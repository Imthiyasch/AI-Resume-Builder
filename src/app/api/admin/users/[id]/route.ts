import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try { cookieStore.set({ name, value, ...options }); } catch {}
        },
        remove(name: string, options: CookieOptions) {
          try { cookieStore.set({ name, value: '', ...options }); } catch {}
        },
      },
    }
  );
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await getSupabase();
  const { is_banned } = await request.json();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { error } = await supabase
      .from('profiles')
      .update({ is_banned })
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await getSupabase();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { error: resumesError } = await supabase
      .from('resumes')
      .delete()
      .eq('user_id', id);

    if (resumesError) throw resumesError;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

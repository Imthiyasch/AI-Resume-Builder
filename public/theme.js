(function() {
  try {
    const theme = localStorage.getItem('data-theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    console.error('Theme initialization failed', e);
  }
})();

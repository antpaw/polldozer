module.exports = function(html) {
  if (typeof html !== 'string') { return ''; }
  return html.replace(/&/g, '&amp;')
      .replace(/>/g, '&gt;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
};

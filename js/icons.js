/* Icônes pixel en SVG (décoratives : toujours accompagnées d'un texte). */
(function () {
  var S = 'xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" shape-rendering="crispEdges"';
  var K = "#111111";
  window.ICONS = {
    folder:
      '<svg ' + S + ' width="44" height="38" viewBox="0 0 44 38"><path d="M2 6h15l3 4h22v26H2z" fill="#F7D774" stroke="' + K + '" stroke-width="2"/><path d="M2 14h40" stroke="' + K + '" stroke-width="2"/></svg>',
    folderWip:
      '<svg ' + S + ' width="44" height="40" viewBox="0 0 44 40"><path d="M2 8h15l3 4h22v26H2z" fill="#F7D774" stroke="' + K + '" stroke-width="2"/><rect x="26" y="2" width="16" height="11" fill="' + K + '"/><path d="M29 7.5h10" stroke="#F7D774" stroke-width="2"/></svg>',
    doc:
      '<svg ' + S + ' width="34" height="40" viewBox="0 0 34 40"><path d="M2 2h21l9 9v27H2z" fill="#FFFFFF" stroke="' + K + '" stroke-width="2"/><path d="M23 2v9h9" fill="none" stroke="' + K + '" stroke-width="2"/><path d="M7 18h20M7 24h20M7 30h13" stroke="' + K + '" stroke-width="2"/><rect x="7" y="7" width="9" height="5" fill="#B3361A"/></svg>',
    terminal:
      '<svg ' + S + ' width="42" height="34" viewBox="0 0 42 34"><rect x="2" y="2" width="38" height="30" fill="' + K + '" stroke="' + K + '" stroke-width="2"/><rect x="2" y="2" width="38" height="6" fill="#EFEBE2" stroke="' + K + '" stroke-width="2"/><path d="M8 14l6 5-6 5M18 26h12" fill="none" stroke="#7CFC9A" stroke-width="2"/></svg>',
    calendar:
      '<svg ' + S + ' width="38" height="38" viewBox="0 0 38 38"><rect x="2" y="6" width="34" height="30" fill="#FFFFFF" stroke="' + K + '" stroke-width="2"/><rect x="2" y="6" width="34" height="8" fill="#B3361A" stroke="' + K + '" stroke-width="2"/><path d="M10 2v8M28 2v8" stroke="' + K + '" stroke-width="2"/><rect x="8" y="19" width="6" height="5" fill="' + K + '"/><rect x="16" y="19" width="6" height="5" fill="' + K + '"/><rect x="24" y="19" width="6" height="5" fill="#F2A33A"/><rect x="8" y="27" width="6" height="5" fill="' + K + '"/></svg>',
    mail:
      '<svg ' + S + ' width="42" height="32" viewBox="0 0 42 32"><rect x="2" y="2" width="38" height="28" fill="#FFFFFF" stroke="' + K + '" stroke-width="2"/><path d="M2 2l19 15L40 2" fill="none" stroke="' + K + '" stroke-width="2"/></svg>',
    watch:
      '<svg ' + S + ' width="36" height="46" viewBox="0 0 36 46"><rect x="10" y="2" width="16" height="9" fill="' + K + '"/><rect x="10" y="35" width="16" height="9" fill="' + K + '"/><rect x="4" y="10" width="28" height="26" fill="#FFFFFF" stroke="' + K + '" stroke-width="2"/><rect x="32" y="18" width="3" height="6" fill="' + K + '"/><path d="M10 18h16M10 23h16M10 28h10" stroke="' + K + '" stroke-width="2"/></svg>',
    server:
      '<svg ' + S + ' width="40" height="44" viewBox="0 0 40 44"><rect x="3" y="2" width="34" height="12" fill="#FFFFFF" stroke="' + K + '" stroke-width="2"/><rect x="3" y="16" width="34" height="12" fill="#FFFFFF" stroke="' + K + '" stroke-width="2"/><rect x="3" y="30" width="34" height="12" fill="#FFFFFF" stroke="' + K + '" stroke-width="2"/><rect x="8" y="7" width="4" height="3" fill="#2F9E5B"/><rect x="8" y="21" width="4" height="3" fill="#2F9E5B"/><rect x="8" y="35" width="4" height="3" fill="#F2A33A"/><path d="M20 8.5h12M20 22.5h12M20 36.5h12" stroke="' + K + '" stroke-width="2"/></svg>',
    user:
      '<svg ' + S + ' width="38" height="40" viewBox="0 0 38 40"><rect x="2" y="2" width="34" height="36" fill="#FFFFFF" stroke="' + K + '" stroke-width="2"/><rect x="13" y="8" width="12" height="12" fill="' + K + '"/><path d="M7 34c0-8 5-11 12-11s12 3 12 11" fill="' + K + '"/></svg>',
    gear:
      '<svg ' + S + ' width="40" height="40" viewBox="0 0 40 40"><rect x="2" y="2" width="36" height="36" fill="#FFFFFF" stroke="' + K + '" stroke-width="2"/><path d="M8 12h24M8 20h24M8 28h24" stroke="' + K + '" stroke-width="2"/><rect x="12" y="9" width="6" height="6" fill="#F2A33A" stroke="' + K + '" stroke-width="2"/><rect x="22" y="17" width="6" height="6" fill="#2F9E5B" stroke="' + K + '" stroke-width="2"/><rect x="15" y="25" width="6" height="6" fill="#2457D6" stroke="' + K + '" stroke-width="2"/></svg>',
    trash:
      '<svg ' + S + ' width="34" height="40" viewBox="0 0 34 40"><path d="M5 10h24l-2 28H7z" fill="#FFFFFF" stroke="' + K + '" stroke-width="2"/><path d="M2 8h30M12 4h10v4M12 16v16M17 16v16M22 16v16" fill="none" stroke="' + K + '" stroke-width="2"/></svg>',
    code:
      '<svg ' + S + ' width="42" height="36" viewBox="0 0 42 36"><rect x="2" y="2" width="38" height="32" fill="#FFFFFF" stroke="' + K + '" stroke-width="2"/><rect x="2" y="2" width="38" height="7" fill="#2457D6" stroke="' + K + '" stroke-width="2"/><path d="M15 15l-6 5 6 5M27 15l6 5-6 5M23 13l-4 14" fill="none" stroke="' + K + '" stroke-width="2"/></svg>',
    // Arbre d'opérations dont les feuilles sont des tables (algèbre relationnelle).
    relalg:
      '<svg ' + S + ' width="44" height="40" viewBox="0 0 44 40"><path d="M22 12v5M10 17h24M10 17v5M34 17v5" fill="none" stroke="' + K + '" stroke-width="2"/><rect x="16" y="2" width="12" height="10" fill="#F2A33A" stroke="' + K + '" stroke-width="2"/><path d="M19 7h6" stroke="' + K + '" stroke-width="2"/><rect x="2" y="22" width="17" height="16" fill="#FFFFFF" stroke="' + K + '" stroke-width="2"/><rect x="2" y="22" width="17" height="5" fill="#2457D6" stroke="' + K + '" stroke-width="2"/><path d="M2 32h17M10 27v11" stroke="' + K + '" stroke-width="2"/><rect x="25" y="22" width="17" height="16" fill="#FFFFFF" stroke="' + K + '" stroke-width="2"/><rect x="25" y="22" width="17" height="5" fill="#2F9E5B" stroke="' + K + '" stroke-width="2"/><path d="M25 32h17M33 27v11" stroke="' + K + '" stroke-width="2"/></svg>',
    // Drapeau de capture-the-flag (fenêtre Activités).
    flag:
      '<svg ' + S + ' width="36" height="42" viewBox="0 0 36 42"><path d="M7 3v36" stroke="' + K + '" stroke-width="3"/><path d="M9 4h23l-6 8 6 8H9z" fill="#B3361A" stroke="' + K + '" stroke-width="2"/><path d="M14 9h7" stroke="#FFFFFF" stroke-width="2"/><rect x="2" y="37" width="12" height="4" fill="' + K + '"/></svg>',
    help:
      '<svg ' + S + ' width="36" height="36" viewBox="0 0 36 36"><rect x="2" y="2" width="32" height="32" fill="#FFFFFF" stroke="' + K + '" stroke-width="2"/><path d="M12 13c0-4 3-6 6-6s6 2 6 5c0 4-6 4-6 9" fill="none" stroke="' + K + '" stroke-width="3"/><rect x="16.5" y="25" width="3" height="3" fill="' + K + '"/></svg>',
    info:
      '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="17" r="15" fill="#FFFFFF" stroke="' + K + '" stroke-width="2"/><path d="M17 15v10M17 9v2" stroke="' + K + '" stroke-width="3"/></svg>',
    plus:
      '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" width="32" height="32" viewBox="0 0 32 32"><path d="M16 5v22M5 16h22" stroke="#555555" stroke-width="2"/></svg>',
    close:
      '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" width="10" height="10" viewBox="0 0 10 10"><path d="M2 2l6 6M8 2l-6 6" stroke="#4D0000" stroke-width="1.8" stroke-linecap="round"/></svg>',
    min:
      '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" width="10" height="10" viewBox="0 0 10 10"><path d="M1 8h8" stroke="' + K + '" stroke-width="2"/></svg>',
    max:
      '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" width="10" height="10" viewBox="0 0 10 10"><rect x="1" y="1" width="8" height="8" fill="none" stroke="' + K + '" stroke-width="2"/></svg>',
    lock:
      '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" width="12" height="12" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4" fill="none" stroke="currentColor" stroke-width="2"/></svg>'
  };
})();

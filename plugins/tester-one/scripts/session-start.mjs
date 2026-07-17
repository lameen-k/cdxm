process.stdin.resume();
process.stdin.on('end', () => {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: 'Tester One is available. For JSONPlaceholder browsing, run scripts/serve-resource-browser.mjs and open the displayed local URL.'
    }
  }));
});

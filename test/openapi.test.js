const test = require('node:test');
const assert = require('node:assert/strict');
const plugin = require('../index');

const context = {
  output: {
    toURL(file) {
      return `/${file}`;
    },
  },
};

function extractContainerId(html) {
  const match = html.match(/id="([^"]+)"/);
  return match ? match[1] : null;
}

test('redoc renderer uses unique container IDs', () => {
  const block = { kwargs: { renderer: 'redoc', file: 'openapi.yaml', height: '400px' } };
  const first = plugin.blocks.openapi.process.call(context, block);
  const second = plugin.blocks.openapi.process.call(context, block);

  const firstId = extractContainerId(first);
  const secondId = extractContainerId(second);

  assert.ok(firstId);
  assert.ok(secondId);
  assert.notStrictEqual(firstId, secondId);
});

test('swagger renderer uses unique container IDs', () => {
  const block = { kwargs: { renderer: 'swagger', file: 'openapi.json', height: '300px' } };
  const first = plugin.blocks.openapi.process.call(context, block);
  const second = plugin.blocks.openapi.process.call(context, block);

  const firstId = extractContainerId(first);
  const secondId = extractContainerId(second);

  assert.ok(firstId);
  assert.ok(secondId);
  assert.notStrictEqual(firstId, secondId);
});

test('unsupported renderer falls back to error snippet', () => {
  const block = { kwargs: { renderer: 'unknown' } };
  const html = plugin.blocks.openapi.process.call(context, block);
  assert.match(html, /Unsupported renderer/);
});

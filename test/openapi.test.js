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

test('page:before hook returns page when no config', () => {
  const hookContext = {
    config: {
      get: () => null,
    },
  };
  const page = { content: 'test content' };
  const result = plugin.hooks['page:before'].call(hookContext, page);
  assert.strictEqual(result, page);
});

test('page:before hook returns page when config exists', () => {
  const hookContext = {
    config: {
      get: (key) => {
        if (key === 'pluginsConfig.openapi-viewer') {
          return { renderer: 'redoc', file: 'api.yaml' };
        }
        return null;
      },
    },
  };
  const page = { content: 'test content' };
  const result = plugin.hooks['page:before'].call(hookContext, page);
  assert.strictEqual(result, page);
});

test('page:before hook handles page with apiTag', () => {
  const hookContext = {
    config: {
      get: (key) => {
        if (key === 'pluginsConfig.openapi-viewer') {
          return { renderer: 'redoc', file: 'api.yaml', height: '500px' };
        }
        return null;
      },
    },
  };
  const page = { content: '{% openapi file="api.yaml" renderer="redoc" height="500px" %}' };
  const result = plugin.hooks['page:before'].call(hookContext, page);
  assert.strictEqual(result, page);
});

test('block process handles defaults correctly', () => {
  const block = { kwargs: {} };
  const html = plugin.blocks.openapi.process.call(context, block);
  assert.ok(html.includes('openapi.yaml'));
  assert.ok(html.includes('800px'));
});

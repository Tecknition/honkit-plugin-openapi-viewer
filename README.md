# Honkit OpenAPI Viewer Plugin

Renders OpenAPI YAML or JSON specs inside your GitBook/Honkit documentation.

## Installation

```bash
npm install honkit-plugin-openapi-viewer
```

Then in your `book.json`:

```json
{
  "plugins": ["openapi-viewer"],
  "pluginsConfig": {
    "openapi-viewer": {
      "renderer": "redoc",
      "file": "./openapi.yaml",
      "height": "900px"
    }
  }
}
```

## Usage in Markdown

```markdown
# API Documentation

{% openapi file="./openapi.yaml" renderer="swagger" height="1000px" %}
```

## Renderer Options

- `renderer`: `"redoc"` or `"swagger"`
- `file`: path to your OpenAPI YAML or JSON file
- `height`: container height (e.g., `"800px"`)

## Example

```markdown
{% openapi file="./openapi.yaml" renderer="redoc" %}
```

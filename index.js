let blockCounter = 0;

module.exports = {
  hooks: {
    'page:before': function (page) {
      if (!this.config.get('pluginsConfig.openapi-viewer')) {return page;}
      const config = this.config.get('pluginsConfig.openapi-viewer') || {};
      const { renderer = 'redoc', file, height = '800px' } = config;
      const apiTag = `{% openapi file="${file}" renderer="${renderer}" height="${height}" %}`;
      if (page.content.includes(apiTag)) {return page;}
      return page;
    },
  },

  blocks: {
    openapi: {
      process: function (block) {
        const file = block.kwargs.file || 'openapi.yaml';
        const renderer = block.kwargs.renderer || 'redoc';
        const height = block.kwargs.height || '800px';
        const idBase = `openapi-${++blockCounter}`;

        let html = '';
        if (renderer === 'redoc') {
          const containerId = `${idBase}-redoc`;
          html = `
            <div id="${containerId}" style="height:${height};"></div>
            <script src="${this.output.toURL('assets/redoc.standalone.js')}"></script>
            <script>
              Redoc.init('${file}', {}, document.getElementById('${containerId}'));
            </script>
          `;
        } else if (renderer === 'swagger') {
          const containerId = `${idBase}-swagger`;
          html = `
            <link rel="stylesheet" href="${this.output.toURL('assets/swagger-ui.css')}" />
            <div id="${containerId}" style="height:${height};"></div>
            <script src="${this.output.toURL('assets/swagger-ui-bundle.js')}"></script>
            <script>
              const ui = SwaggerUIBundle({
                url: '${file}',
                dom_id: '#${containerId}',
                presets: [SwaggerUIBundle.presets.apis],
                layout: "BaseLayout"
              });
            </script>
          `;
        } else {
          html = `<pre class="openapi-error">Unsupported renderer: ${renderer}</pre>`;
        }
        return html;
      },
    },
  },

  assets: './assets',
};

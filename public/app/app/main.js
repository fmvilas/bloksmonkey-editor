require.config({
  baseUrl: '/app/app',
  paths: {
    //RequireJS plugins
    text: 'components/requirejs-text/text',
    //Didgeridoo modules and libs
    core: 'core/core',

    'API.Action': 'api/action/action',
    'API.Event': 'api/event/event',
    'API.File': 'api/file/file',
    'API.Project': 'api/project/project',
    'API.Shortcut': 'api/shortcut/shortcut',
    'API.Util': 'api/util/util',
    'API.User': 'api/user/user',

    autogrow: 'libs/autoGrowInput/autoGrowInput',
    codemirror: 'libs/codemirror/codemirror',
    codemirror_script: 'components/codemirror/lib/codemirror',
    dynatree: 'components/dynatree/dist/jquery.dynatree.min',
    jquery: 'components/jquery/dist/jquery.min',
    'jquery.ui': 'components/jquery-ui/jquery-ui',
    'largeLocalStorage': 'components/lls/dist/LargeLocalStorage',
    Q: 'components/q/q',
    underscore: 'components/underscore/underscore',

    layout: 'modules/layout/layout',
    tabs: 'modules/tabs/tabs',
    tab: 'modules/tabs/tab'
  },
  shim: {
    autogrow: {
      deps: ['jquery'],
      exports: '$.fn.autoGrowInput'
    },
    codemirror: {
      deps: ['codemirror_script'],
      exports: 'CodeMirror'
    },
    core: {
      deps: ['jquery'],
      exports: 'didgeridoo'
    },
    dynatree: {
      deps: ['jquery'],
      exports: '$.fn.dynatree'
    },
    jquery: {
      exports: '$'
    },
    'jquery-ui': {
      deps: ['jquery'],
      exports: '$.ui'
    }
  }
});

require(['init']);


oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g otter-video-cli
$ otter COMMAND
running command...
$ otter (--version)
otter-video-cli/0.0.2 darwin-x64 node-v19.5.0
$ otter --help [COMMAND]
USAGE
  $ otter COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`otter deploy`](#otter-deploy)
* [`otter destroy`](#otter-destroy)
* [`otter help [COMMANDS]`](#otter-help-commands)
* [`otter plugins`](#otter-plugins)
* [`otter plugins:install PLUGIN...`](#otter-pluginsinstall-plugin)
* [`otter plugins:inspect PLUGIN...`](#otter-pluginsinspect-plugin)
* [`otter plugins:install PLUGIN...`](#otter-pluginsinstall-plugin-1)
* [`otter plugins:link PLUGIN`](#otter-pluginslink-plugin)
* [`otter plugins:uninstall PLUGIN...`](#otter-pluginsuninstall-plugin)
* [`otter plugins:uninstall PLUGIN...`](#otter-pluginsuninstall-plugin-1)
* [`otter plugins:uninstall PLUGIN...`](#otter-pluginsuninstall-plugin-2)
* [`otter plugins update`](#otter-plugins-update)

## `otter deploy`

deploy otter aws infrastructure

```
USAGE
  $ otter deploy

DESCRIPTION
  deploy otter aws infrastructure
```

_See code: [dist/commands/deploy.ts](https://github.com/otter-framework/otter-cli/blob/v0.0.2/dist/commands/deploy.ts)_

## `otter destroy`

destroy otter aws infrastructure

```
USAGE
  $ otter destroy

DESCRIPTION
  destroy otter aws infrastructure
```

_See code: [dist/commands/destroy.ts](https://github.com/otter-framework/otter-cli/blob/v0.0.2/dist/commands/destroy.ts)_

## `otter help [COMMANDS]`

Display help for otter.

```
USAGE
  $ otter help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for otter.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.7/src/commands/help.ts)_

## `otter plugins`

List installed plugins.

```
USAGE
  $ otter plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ otter plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.4.0/src/commands/plugins/index.ts)_

## `otter plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ otter plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ otter plugins add

EXAMPLES
  $ otter plugins:install myplugin 

  $ otter plugins:install https://github.com/someuser/someplugin

  $ otter plugins:install someuser/someplugin
```

## `otter plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ otter plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ otter plugins:inspect myplugin
```

## `otter plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ otter plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ otter plugins add

EXAMPLES
  $ otter plugins:install myplugin 

  $ otter plugins:install https://github.com/someuser/someplugin

  $ otter plugins:install someuser/someplugin
```

## `otter plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ otter plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ otter plugins:link myplugin
```

## `otter plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ otter plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ otter plugins unlink
  $ otter plugins remove
```

## `otter plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ otter plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ otter plugins unlink
  $ otter plugins remove
```

## `otter plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ otter plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ otter plugins unlink
  $ otter plugins remove
```

## `otter plugins update`

Update installed plugins.

```
USAGE
  $ otter plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->

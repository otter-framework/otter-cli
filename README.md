# Otter Framework CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/otter-video-cli.svg)](https://npmjs.org/package/otter-video-cli)

<!-- toc -->
* [Otter Framework CLI](#otter-framework-cli)
* [Todo](#todo)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Todo

- more options for deploy
- more robust error handling
- `otter status`: Health check all components and show the results
- `otter config`: Display configuration file location (and maybe allow user to change them through cli)
- `otter` and `otter --help`: Show introduction and help info
- If Otter is deployed and user tries to `otter deploy` again, we could do:

  - create a cloudformation changeset and deploy it, or
  - ask user to `destroy` first before running `deploy` again

# Usage

<!-- usage -->
```sh-session
$ npm install -g otter-video-cli
$ otter COMMAND
running command...
$ otter (--version)
otter-video-cli/0.3.1 darwin-x64 node-v19.5.0
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
* [`otter dev`](#otter-dev)
* [`otter help [COMMANDS]`](#otter-help-commands)

## `otter deploy`

deploy otter aws infrastructure

```
USAGE
  $ otter deploy

DESCRIPTION
  deploy otter aws infrastructure
```

_See code: [dist/commands/deploy.ts](https://github.com/otter-framework/otter-cli/blob/v0.3.1/dist/commands/deploy.ts)_

## `otter destroy`

destroy otter aws infrastructure

```
USAGE
  $ otter destroy

DESCRIPTION
  destroy otter aws infrastructure
```

_See code: [dist/commands/destroy.ts](https://github.com/otter-framework/otter-cli/blob/v0.3.1/dist/commands/destroy.ts)_

## `otter dev`

why are you here?

```
USAGE
  $ otter dev

DESCRIPTION
  why are you here?
```

_See code: [dist/commands/dev.ts](https://github.com/otter-framework/otter-cli/blob/v0.3.1/dist/commands/dev.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.8/src/commands/help.ts)_
<!-- commandsstop -->

A web app to capture audio clips and manage a database of sounds.

![CI](https://github.com/mdr/web-sampler/actions/workflows/ci.yml/badge.svg)

[Try online](https://mdr.github.io/web-sampler/). (Warning: still pre-alpha so may lose your data).

## Development

The development tools (Node, Yarn, Task, etc.) are pinned in a [Nix](https://nixos.org/) flake. Enter the dev shell with:

```sh
nix develop
```

or, with [direnv](https://direnv.net/), run `direnv allow` once and the shell loads automatically. Then run `task` to list the available tasks.

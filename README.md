# @winterhuan/dsh-project-default-mode

English | [中文](README.zh.md)

Per-project default agent preset for DSH sessions.

[Plugin documentation](packages/winterhuan/project-default-mode/README.md) · [Release package](https://github.com/winterhuan/dsh-project-default-mode/releases/download/v0.1.0/winterhuan-dsh-project-default-mode-0.1.0.tgz)

Use Node 24 (default) or Node 22.19 and later, with pnpm 11.7.0.

```sh
git clone https://github.com/winterhuan/dsh-project-default-mode.git
cd dsh-project-default-mode
git submodule update --init
pnpm install
pnpm run typecheck
pnpm run build
pnpm test
```

The upstream submodule supplies client test sources. Builds use the published DSH dependencies. The plugin source is in `packages/winterhuan/project-default-mode`.

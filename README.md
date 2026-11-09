# @winterhuan/dsh-project-default-mode

English | [中文](README.zh.md)

Per-project default agent preset for DSH sessions.

[Plugin documentation](packages/winterhuan/project-default-mode/README.md) · [Release package](https://github.com/winterhuan/dsh-project-default-mode/releases/download/v0.1.9/winterhuan-dsh-project-default-mode-0.1.9.tgz)

For DSH `0.2.2-rc.1`, enable Custom plugin market and add `https://winterhuan.github.io/dsh-creative/index.json` in Discover. Alternatively, install the prebuilt Git version with pnpm 11.7.0:

```sh
dsh plugin --profile market add 'git+https://github.com/winterhuan/dsh-project-default-mode.git#v0.1.9&path:/packages/winterhuan/project-default-mode'
```

Replace `market` with the name of your existing DSH profile.

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

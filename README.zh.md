# @winterhuan/dsh-project-default-mode

[English](README.md) | 中文

为 DSH 项目设置新会话默认使用的 Agent 预设。

[插件说明](packages/winterhuan/project-default-mode/README.zh.md) · [发布包](https://github.com/winterhuan/dsh-project-default-mode/releases/download/v0.1.0/winterhuan-dsh-project-default-mode-0.1.0.tgz)

默认使用 Node 24，也兼容 Node 22.19 及以上；pnpm 版本为 11.7.0。

```sh
git clone https://github.com/winterhuan/dsh-project-default-mode.git
cd dsh-project-default-mode
git submodule update --init
pnpm install
pnpm run typecheck
pnpm run build
pnpm test
```

upstream 子模块提供客户端测试源码。构建使用发布版 DSH 依赖。插件源码位于 `packages/winterhuan/project-default-mode`。

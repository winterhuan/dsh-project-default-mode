# @winterhuan/dsh-project-default-mode

[English](README.md) | 中文

为 DSH 项目设置新会话默认使用的 Agent 预设。

[插件说明](packages/winterhuan/project-default-mode/README.zh.md) · [发布包](https://github.com/winterhuan/dsh-project-default-mode/releases/download/v0.1.8/winterhuan-dsh-project-default-mode-0.1.8.tgz)

在 DSH `0.2.2-rc.1` 中启用「自定义插件市场」，在「发现」添加 `https://winterhuan.github.io/dsh-creative/index.json`。也可用 pnpm 11.7.0 安装已构建的 Git 版本：

```sh
dsh plugin --profile market add 'git+https://github.com/winterhuan/dsh-project-default-mode.git#44b6a3d3e6f8e4208fc50fc33de2e5d5b6ed9d1f&path:/packages/winterhuan/project-default-mode'
```

将 `market` 替换为你已有的 DSH profile 名称。

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

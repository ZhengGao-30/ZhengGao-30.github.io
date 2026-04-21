# Character Model Replacement

这个目录用于存放首页 3D 角色模型。

## 推荐替换方式

把你的新模型放到这里，并命名为：

```text
character.glb
```

当前前端加载顺序是：

1. 如果配置了 `VITE_CHARACTER_MODEL_URL`，优先加载该地址。
2. 否则尝试加载 `/models/character.glb`。
3. 如果没有找到普通 `.glb`，回退加载旧的 `/models/character.enc?v=2`。

因此最简单的替换方式是直接新增：

```text
Portfolio/public/models/character.glb
```

不需要先加密。

## 当前模型

当前 `character.glb` 来自 Kenney 的 `Blocky Characters (2.0)` 资源包：

- 源文件：`character-r.glb`
- 角色：黑色忍者角色
- 许可：Creative Commons Zero, CC0
- 许可文件：`kenney-blocky-characters-license.txt`

## 模型格式建议

- 优先使用 `.glb`。
- 如果模型使用 Draco 压缩，当前项目已经配置了 `/draco/` 解码器。
- 尽量控制模型大小，建议先压缩到 5 MB 到 15 MB 以内。
- 模型最好自带材质和贴图，避免依赖外部相对路径。

## 动画兼容说明

原模型包含一套专用骨骼、对象名和动画：

- `spine006`
- `spine005`
- `screenlight`
- `footR`
- `footL`
- `Plane004`
- `Material.018`
- `introAnimation`
- `Blink`
- `key1`
- `key2`
- `key5`
- `key6`
- `typing`
- `browup`

现在代码已经做了兼容处理。新模型缺少这些名称时，页面不会因为缺少对象直接崩溃，但对应的头部跟随、眨眼、打字、显示器灯光等专用动画会自动跳过。

## 使用自定义路径

如果不想把文件命名为 `character.glb`，可以在项目根目录 `Portfolio/` 下创建 `.env.local`：

```text
VITE_CHARACTER_MODEL_URL=/models/your-model.glb
```

然后重启开发服务器。

## 替换后必须检查

替换模型后运行：

```bash
npm run build
npm run dev
```

重点检查：

- 首屏模型是否显示
- 模型尺寸是否过大或过小
- 模型位置是否偏离屏幕
- 滚动时页面是否报错
- 移动端是否还能正常加载

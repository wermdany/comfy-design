import { Bounds, Box, Text } from 'leafer-ui'
import { Editor, EditorEvent, EditorScaleEvent } from '@leafer-in/editor'
import { mergeConfig } from '@comfy-design/shared'
import { PluginOrder, withPluginsProxyProperty } from '@comfy-design/core'

import type { IBoundsData, IUI, IEditorConfig } from '@leafer-ui/interface'
import type { IEditor } from '@leafer-in/interface'
import type { ComfyDesign } from '@comfy-design/core'

export const defaultEditorConfig: EditorConfig = {
  editSize: 'auto',
  strokeWidth: 1,
  pointRadius: 2,
  pointSize: 8,
  stroke: '#457af7',
  skewable: false,
  hideOnMove: true,
  buttonsFixed: true,
  buttonsMargin: 8,
  textBgFill: '#457af7'
}

export interface EditorConfig extends IEditorConfig {
  textBgFill: string
}

export type ComfyDesignEditorConfig = Partial<EditorConfig> | true

export class ComfyDesignEditor {
  static pluginName = 'editor'
  static order = PluginOrder.Pre

  private text: IUI
  private editor: Editor
  private box: IUI
  private config: EditorConfig

  constructor(private design: ComfyDesign) {
    this.config = mergeConfig(defaultEditorConfig, design.config.editor)

    this.text = this.createText()
    this.editor = this.createEditor()
    this.box = this.createBox()

    this.box.add(this.text)
    this.editor.buttons.add(this.box)

    this.editor.on(EditorEvent.SELECT, this.handleEditorSelect.bind(this))
    this.editor.on(EditorScaleEvent.SCALE, this.handleEditorScale.bind(this))

    this.initEditor()

    design.registerProxyProperty(withPluginsProxyProperty(ComfyDesignEditor))
  }

  private initEditor() {
    this.design.LeaferApp.editor = this.editor
    this.design.LeaferApp.sky.add(this.editor)
  }

  private updateText(list: IUI[]) {
    const first = list.shift()!

    const bounds = new Bounds(first as IBoundsData)

    list.forEach(target => {
      bounds.add(target as IBoundsData)
    })

    const width = Math.round(bounds.width)
    const height = Math.round(bounds.height)

    this.text.set({
      text: `${width} × ${height}`
    })
  }

  private handleEditorSelect(event: EditorEvent) {
    const { editor } = event

    this.updateText(this.getEditorList(editor))
  }

  private handleEditorScale(event: EditorEvent) {
    const { editor } = event

    this.updateText(this.getEditorList(editor))
  }

  private getEditorList(editor: IEditor): IUI[] {
    return editor.list.slice() || []
  }

  private createBox() {
    return Box.one({ around: 'center', fill: this.config.textBgFill, cornerRadius: 4 })
  }

  private createEditor() {
    return new Editor(this.config)
  }

  private createText() {
    return Text.one({
      around: 'center',
      fill: 'white',
      cornerRadius: 4,
      text: '0 × 0',
      padding: [2, 8]
    })
  }
}

interface ComfyDesignEditorApi {
  /**
   * 编辑工具实例
   * @proxy editor
   */
  editor: ComfyDesignEditor
}

declare module '@comfy-design/core' {
  interface CustomConfig {
    editor?: ComfyDesignEditorConfig
  }

  interface CustomApi {
    editor: ComfyDesignEditorApi
  }
}

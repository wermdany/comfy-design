import { Bounds, Box, Text } from 'leafer-ui'
import { Editor, EditorEvent, EditorScaleEvent } from '@leafer-in/editor'

import type { IBoundsData, IEditorConfig, IUI } from '@leafer-ui/interface'

import type { ComfyDesignCtor } from './ComfyDesignCore'

const defaultEditorConfig: IEditorConfig = {
  editSize: 'auto',
  strokeWidth: 1,
  pointRadius: 2,
  pointSize: 8,
  stroke: '#457af7',
  skewable: false,
  hideOnMove: true,
  buttonsFixed: true,
  buttonsMargin: 8
}

export class ComfyDesignEditor {
  private text: IUI
  private editor: Editor
  private box: IUI

  constructor(private design: ComfyDesignCtor) {
    this.text = this.createText()
    this.editor = this.createEditor()
    this.box = this.createBox()

    this.box.add(this.text)
    this.editor.buttons.add(this.box)

    this.editor.on(EditorEvent.SELECT, this.handleEditorSelect.bind(this))
    this.editor.on(EditorScaleEvent.SCALE, this.handleEditorScale.bind(this))
  }

  public initEditor() {
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

  private getEditorList(editor: Editor): IUI[] {
    return editor.list.slice() || []
  }

  private createBox() {
    return Box.one({ around: 'center', fill: '#457af7', cornerRadius: 4 })
  }

  private createEditor() {
    return new Editor(defaultEditorConfig)
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

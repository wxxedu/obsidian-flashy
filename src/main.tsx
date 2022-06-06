import { App, Plugin, PluginSettingTab, Setting, TFile } from "obsidian";
import * as ReactDomClient from "react-dom/client";
import * as React from "react";
import Card from "./components/Card";
import Cards from "./components/Cards";
import CardModel from "./models/card_model";
import InfoView from "./components/InfoView";
import CardManager from "./models/card_manager";


export default class MyPlugin extends Plugin {
  // This field stores your plugin settings.
  setting: MyPluginSettings;

  onInit() {}

  async onload() {
    console.log("Plugin is Loading...");

    // This snippet of code is used to load pluging settings from disk (if any)
    // and then add the setting tab in the Obsidian Settings panel.
    // If your plugin does not use settings, you can delete these two lines.
    this.setting = (await this.loadData()) || {
      someConfigData: 1,
      anotherConfigData: "defaultValue",
    };
    this.addSettingTab(new MyPluginSettingsTab(this.app, this));
    
    // Renders a single card in position
    this.registerMarkdownCodeBlockProcessor("flashy", (source, el, ctx) => {
      const root = ReactDomClient.createRoot(el);
      if (source.split("\n---\n").length < 2 || source.split("\n---\n").length > 3) {
        root.render(<InfoView title="Invalid Flashcard" message="Flashcard must be divided by --- into 2 or 3 segments, with the first segment being the card front, the second being the card back, and the third (optional) being review information." />);
        return;
      }
      let model = new CardModel(
        source,
        ctx.sourcePath,
        this.app.vault,
      );
      root.render(
        <Card model={model} />
      );
    });

    // Renders a list of cards in position
    this.registerMarkdownCodeBlockProcessor("flashy-cards", async (source, el, ctx) =>{ 
      const root = ReactDomClient.createRoot(el);
      // finds all the text in the flashy code block
      const file = this.app.vault.getAbstractFileByPath(ctx.sourcePath) as TFile;
      const manager = await CardManager.fromFile(file, this.app.vault, source);
      root.render(
        <Cards manager={manager} />
      );
    });
  }

  onunload() {
    console.log("Plugin is Unloading...");
  }
}

/**
 * This is a data class that contains your plugin configurations. You can edit it
 * as you wish by adding fields and all the data you need.
 */
interface MyPluginSettings {
  someConfigData: number;
  anotherConfigData: string;
}

class MyPluginSettingsTab extends PluginSettingTab {
  plugin: MyPlugin;

  constructor(app: App, plugin: MyPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    const settings = this.plugin.setting;
    // This is just an example of a setting controll.
    new Setting(containerEl)
      .setName("Setting Name")
      .setDesc("Setting description")
      .addText((text) =>
        text.setValue(String(settings.someConfigData)).onChange((value) => {
          if (!isNaN(Number(value))) {
            settings.someConfigData = Number(value);
            this.plugin.saveData(settings);
          }
        })
      );
  }
}

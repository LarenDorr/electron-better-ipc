import {BrowserWindow, BrowserView, IpcMain, IpcRenderer} from 'electron';

type DefaultInterface = {
	data: unknown;
	return: unknown;
}

export interface MainProcessIpc extends IpcMain {
	/**
	Send a message to the given window.

	In the renderer process, use `ipcRenderer.answerMain` to reply to this message.

	@param browserWindow - The window to send the message to.
	@param channel - The channel to send the message on.
	@param data - The data to send to the receiver.
	@returns - The reply from the renderer process.

	@example
	```
	import {BrowserWindow} from 'electron';
	import {ipcMain as ipc} from 'electron-better-ipc';

	const browserWindow = BrowserWindow.getFocusedWindow();

	(async () => {
		const emoji = await ipc.callRenderer(browserWindow!, 'get-emoji', 'unicorn');
		console.log(emoji);
		//=> '🦄'
	})();
	```
	*/
	callRenderer<Interface = DefaultInterface>(
		browserWindow: BrowserWindow,
		channel: string,
		data?: Interface['data']
	): Promise<Interface['return']>;

	/**
	Send a message to the focused window, as determined by `electron.BrowserWindow.getFocusedWindow`.

	In the renderer process, use `ipcRenderer.answerMain` to reply to this message.

	@param channel - The channel to send the message on.
	@param data - The data to send to the receiver.
	@returns - The reply from the renderer process.

	@example
	```
	import {ipcMain as ipc} from 'electron-better-ipc';

	(async () => {
		const emoji = await ipc.callFocusedRenderer('get-emoji', 'unicorn');
		console.log(emoji);
		//=> '🦄'
	})();
	```
	*/
	callFocusedRenderer<Interface = DefaultInterface>(
		channel: string,
		data?: Interface['data']
	): Promise<Interface['return']>;

	/**
	This method listens for a message from `ipcRenderer.callMain` defined in a renderer process and replies back.

	@param channel - The channel to send the message on.
	@param callback - The return value is sent back to the `ipcRenderer.callMain` in the renderer process.
	@returns A function, that when called, removes the listener.

	@example
	```
	import {ipcMain as ipc} from 'electron-better-ipc';

	ipc.answerRenderer('get-emoji', async emojiName => {
		const emoji = await getEmoji(emojiName);
		return emoji;
	});
	```
	*/
	answerRenderer<Interface = DefaultInterface>(
		channel: string,
		callback: (
			data: Interface['data'],
			browserWindow: BrowserView
		) => Interface['return'] | PromiseLike<Interface['return']>
	): () => void;

	/**
	Send a message to all renderer processes (windows).

	@param channel - The channel to send the message on.
	@param data - The data to send to the receiver.
	*/
	sendToRenderers<DataType>(channel: string, data?: DataType): void;
}

export interface RendererProcessIpc extends IpcRenderer {
	/**
	Send a message to the main process.

	In the main process, use `ipcMain.answerRenderer` to reply to this message.

	@param channel - The channel to send the message on.
	@param data - The data to send to the receiver.
	@returns The reply from the main process.

	@example
	```
	import {ipcRenderer as ipc} from 'electron-better-ipc';

	(async () => {
		const emoji = await ipc.callMain('get-emoji', 'unicorn');
		console.log(emoji);
		//=> '🦄'
	})();
	```
	*/
	callMain<Interface = DefaultInterface>(channel: string, data?: Interface['data']): Promise<Interface['return']>;

	/**
	This method listens for a message from `ipcMain.callRenderer` defined in the main process and replies back.

	@param channel - The channel to send the message on.
	@param callback - The return value is sent back to the `ipcMain.callRenderer` in the main process.
	@returns A function, that when called, removes the listener.

	@example
	```
	import {ipcRenderer as ipc} from 'electron-better-ipc';

	ipc.answerMain('get-emoji', async emojiName => {
		const emoji = await getEmoji(emojiName);
		return emoji;
	});
	```
	*/
	answerMain<Interface = DefaultInterface>(
		channel: string,
		callback: (data: Interface['data']) => Interface['return'] | PromiseLike<Interface['return']>
	): () => void;
}

export const ipcMain: MainProcessIpc;
export const ipcRenderer: RendererProcessIpc;

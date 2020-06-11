import * as vscode from 'vscode';
import { commands, ExtensionContext } from 'vscode';
import { Command } from './common/constant';
import ServiceManager from './manager/serviceManager';
import { FileNode } from './node/fileNode';
import { ParentNode } from './node/parentNode';
import { Console } from './common/outputChannel';
import { Util } from './common/util';

export function activate(context: ExtensionContext) {

    const serviceManager = new ServiceManager(context)

    context.subscriptions.push(
        ...serviceManager.init(),
        ...initCommand({
            'ssh.add': () => serviceManager.provider.add(),
            'ssh.connection.terminal': (parentNode: ParentNode) => parentNode.openTerminal(),
            'ssh.connection.delete': (parentNode: ParentNode) => serviceManager.provider.delete(parentNode),
            'ssh.folder.new': (parentNode: ParentNode) => parentNode.newFolder(),
            'ssh.file.new': (parentNode: ParentNode) => parentNode.newFile(),
            'ssh.IP.copy': (parentNode: ParentNode) => parentNode.copyIP(),
            'ssh.forward.port': (parentNode: ParentNode) => parentNode.fowardPort(),
            'ssh.file.upload': (parentNode: ParentNode) => parentNode.upload(),
            'ssh.folder.open': (parentNode: ParentNode) => parentNode.openInTeriminal(),
            'ssh.file.delete': (fileNode: FileNode | ParentNode) => fileNode.delete(),
            'ssh.file.open': (fileNode: FileNode) => fileNode.open(),
            'ssh.file.download': (fileNode: FileNode) => fileNode.download(),
            [Command.REFRESH]: () => serviceManager.provider.refresh(),
        }),

    )
}

function commandWrapper(commandDefinition: any, command: string): (...args: any[]) => any {
    return (...args: any[]) => {
        try {
            commandDefinition[command](...args);
        }
        catch (err) {
            Console.log(err);
        }
    };
}

function initCommand(commandDefinition: any): vscode.Disposable[] {

    const dispose = []

    for (const command in commandDefinition) {
        if (commandDefinition.hasOwnProperty(command)) {
            dispose.push(vscode.commands.registerCommand(command, commandWrapper(commandDefinition, command)))
        }
    }

    return dispose;
}

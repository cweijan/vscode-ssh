import * as vscode from 'vscode';
import { TerminalService } from "./terminalService";
import { SSHConfig } from '../../node/sshConfig';

export class ClassicTerminal implements TerminalService {
    openPath(sshConfig: SSHConfig,fullPath: string): void {
        if (!vscode.window.activeTerminal) {
            vscode.window.showErrorMessage("You must open terminal.")
        } else {
            vscode.window.activeTerminal.sendText(`cd ${fullPath}`)
        }
    }

    openMethod(sshConfig: import("../../node/sshConfig").SSHConfig): void {

        const sendConfirm = "SEND PASSWORD";
        const sshterm = vscode.window.activeTerminal ? vscode.window.activeTerminal : vscode.window.createTerminal(sshConfig.username + "@" + sshConfig.host);
        sshterm.sendText(`ssh ${sshConfig.username}@${sshConfig.host} -o StrictHostKeyChecking=no ${sshConfig.private ? ` -i ${sshConfig.private}` : ''} `);
        sshterm.show();
        const auth = sshConfig.password || sshConfig.passphrase;
        if (auth) {
            vscode.window.showQuickPick([sendConfirm], { ignoreFocusOut: true }).then(res => {
                if (res == sendConfirm) {
                    sshterm.sendText(sshConfig.password)
                }
            })
        }

    }

}
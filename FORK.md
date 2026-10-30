# Personal SFTP fork

This fork preserves the upstream MIT license and author credit. Its extension ID is `chingizhumbatov.sftp-chingizhumbatov`; installation from VSIX does not require a Marketplace publisher account.

## Build in Codex Desktop on macOS

Open this repository folder as a local project in Codex Desktop. Ask Codex to inspect changes, update dependencies, run tests and package a VSIX. Review the diff before committing. Use GitHub browser login rather than pasting tokens into chat.

```sh
npm ci --ignore-scripts
npm test -- --runInBand
npm run package
```

The install skips dependency lifecycle scripts. Optional native SSH acceleration is omitted from the VSIX so the package uses the JavaScript fallback and is portable across macOS CPU architectures. The package command runs the production build automatically.

## Install and verify

1. In VS Code, disable the original `Natizyskunk.sftp` and any other SFTP extension; their command IDs overlap.
2. Run **Extensions: Install from VSIX…**, choose the downloaded VSIX, then reload VS Code.
3. In a separate test workspace, use **SFTP: Config**. Keep `.vscode/sftp.json` local and use an SSH agent/key where possible. Do not put passwords, private keys or production configuration in this repository.
4. On a test server, list a directory, open/download a small file, upload a disposable file and compare its contents. Check the SFTP output for `isDate is not a function`. Do not test whole-project sync or deletion against production.
5. To roll back, disable/uninstall this fork and re-enable the original extension.

Automated checks cover the real ssh2 OPEN attribute encoder for empty, Date and numeric timestamps on modern Node.js. They do not replace a live VS Code/server test.

## Update and release

Keep `origin` pointed at your fork and `upstream` at Natizyskunk/vscode-sftp. Work in a feature branch; commit only reviewed source, manifest, lockfile and tests. Never add `.env`, private keys or `.vscode/sftp.json`. Do not use `git add .` without inspecting the file list.

For a later version, change the manifest and lockfile version together, run `npm ci --ignore-scripts`, tests and packaging, inspect the ZIP contents, then push a feature branch and create a PR against your fork. Publish a GitHub Release targeting the exact tested commit and attach the VSIX and SHA256 checksum. GitHub Release distribution does not publish to the VS Code Marketplace.

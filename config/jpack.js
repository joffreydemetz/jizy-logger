import fs from 'fs';
import path from 'path';
import { LogMe, jPackConfig, removeEmptyDirs } from 'jizy-packer';

const jPackData = {
    name: 'jLogger',
    alias: 'jizy-logger',
    cfg: 'logger',
    assetsPath: 'dist',

    buildTarget: null,
    buildZip: false,
    buildName: 'default',

    onCheckConfig: () => { },

    onGenerateBuildJs: (code) => code,

    onGenerateWrappedJs: (wrapped) => wrapped,

    onPacked: () => { }
};

export default jPackData;
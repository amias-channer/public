import compareSemversions from 'frontend-core/dist/utils/compare-semversions';

export default function isFourthlineScannerSupported(): boolean {
    return window.Fourthline?.version !== undefined && compareSemversions(window.Fourthline.version, '1.3.0', '>=');
}

export function getPathFromStepName(stepName: string): string {
    return stepName.toLowerCase().replace(/_/g, '-');
}

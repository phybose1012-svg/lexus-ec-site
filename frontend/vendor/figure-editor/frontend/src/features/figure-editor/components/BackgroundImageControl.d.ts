import { type BackgroundSettings } from "../lib/backgroundSettings";
interface BackgroundImageControlProps {
    settings: BackgroundSettings;
    disabled?: boolean;
    onChange: (patch: Partial<BackgroundSettings>) => void;
}
export declare function BackgroundImageControl({ settings, disabled, onChange, }: BackgroundImageControlProps): import("react").JSX.Element;
export {};

import clsx from 'clsx';
import { THEME, useTheme } from './context/ThemeProvider';

export default function ThemeContext() {
    const { theme } = useTheme();
        
    const isLightMode = theme === THEME.LIGHT;
        
    return (
        <div className={clsx('p-r h-dvh w-full', isLightMode ? 'bg-white' : 'bg-gray-800')}>
            <h1 className={clsx(
                'text-wxl font-bold', 
                isLightMode ? 'text-black' : 'text-white'
                )}
            >
                Theme Content
            </h1>
            <p className={clsx('mt-2', isLightMode ? 'text-black' : 'text-white')}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae fuga facilis deleniti dolore modi inventore earum placeat dolores. Enim omnis optio ad? Vero perspiciatis voluptatum eos, ea deleniti cum itaque!
            </p>
        </div>
    )
}
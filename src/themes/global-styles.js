import { createGlobalStyle } from 'styled-components'

import jafDomus100 from './assets/jaf-domus/jaf-domus-100.ttf'
import jafDomus400 from './assets/jaf-domus/jaf-domus-400.ttf'
import jafDomus600 from './assets/jaf-domus/jaf-domus-600.ttf'
import jafDomus700 from './assets/jaf-domus/jaf-domus-700.ttf'

export const createStyles = ({ theme, custom = '' }) => {
	return createGlobalStyle`
        @font-face {
            font-family: 'jaf-domus';
            src: url(${jafDomus100});
            font-weight: 100;
        }

        @font-face {
            font-family: 'jaf-domus';
            src: url(${jafDomus400});
            font-weight: 400;
        }

        @font-face {
            font-family: 'jaf-domus';
            src: url(${jafDomus600});
            font-weight: 600;
        }

        @font-face {
            font-family: 'jaf-domus';
            src: url(${jafDomus700});
            font-weight: 700;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body,
        html,
        #root {
            width: 100%;
            height: 100%;
            color: ${theme.colors.bodyColor};
            background: ${theme.colors.bodyBg};
            font-family: ${theme.fontStack.default};
        }

        body {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -webkit-tap-highlight-color: transparent;
        }

        h1 {
            font-weight: 700;
            font-size: 24px;
            font-weight: 900;
            line-height: 32px;
        }

        h1.app-title {
            font-family: jaf-domus;
        }

        a {
		    text-decoration: none;
		    color: inherit;
	    }

        p {
            font-size: 17px;
            font-weight: 400px;
            line-height: 24px;
        }

        ${custom};
    `
}

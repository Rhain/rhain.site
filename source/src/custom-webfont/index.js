const webfont = require('webfont').default;
var path = require('path');
var fs = require('fs-extra');
var crypto = require('crypto');

    webfont({
        files: 'src/svg/**/*.svg',
        fontName: 'fontawesome',
        template: path.resolve(__dirname, './webfont.css.njk'),
        cssTemplateFontPath: '../fonts/',
        cssTemplateClassName: 'fa',
        dest: {
            fontsDir: path.resolve(__dirname, './dist/fonts'),
            stylesDir: path.resolve(__dirname, './dist/css'),
        }
    })
    .then((result) => {

        const { fontName } = result.config;
        const dest = path.resolve(result.config.dest.fontsDir);

        let destStyles = null;

        const hashObj = crypto.createHash('md5').update(result['svg']);
        const fullHash = hashObj.digest('hex');
        const shortHash =  fullHash.substr(0, 10);

        if (result.styles) {
            if (result.config.dest.stylesDir) {
                destStyles = path.resolve(result.config.dest.stylesDir);
            }

            if (!destStyles) {
                destStyles = dest;
            }

            if (result.usedBuildInStylesTemplate) {
                destStyles = path.join(
                    destStyles,
                    `${result.config.fontName}.${result.config
                        .template}`
                );
            } else if (result.config.dest.outputFilename) {
                destStyles = path.join(
                    destStyles,
                    result.config.dest.outputFilename
                );
            } else {
                destStyles = path.join(
                    destStyles,
                    path
                        .basename(result.config.template)
                        .replace(".njk", "")
                );
            }

            result.styles = result.styles.replace(/#hash#/g, shortHash);
        }

        return Promise.all(
            Object.keys(result).map(type => {
                if (
                    type === "config" ||
                    type === "usedBuildInStylesTemplate"
                ) {
                    return Promise.resolve();
                }

                const content = result[type];
                let destFilename = null;

                if (type !== "styles") {
                    destFilename = path.resolve(
                        path.join(dest, `${fontName}.${type}`)
                    );
                } else {
                    destFilename = path.resolve(destStyles);
                }


                return new Promise((resolve, reject) => {

                    const index = destFilename.lastIndexOf('.');
                    if(index >=0){
                        destFilename = destFilename.substring(0, index) + '.' + shortHash + destFilename.substring(index, destFilename.length);
                    }

                    fs.outputFile(destFilename, content, error => {
                        if (error) {
                            return reject(new Error(error));
                        }
                        console.log('generate file:' + destFilename);
                        return resolve();
                    });
                });
            })
        );
    });
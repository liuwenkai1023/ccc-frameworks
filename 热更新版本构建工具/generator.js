var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

var manifest = {
    packageUrl: 'http://localhost/tutorial-hot-update/remote-assets/',
    remoteManifestUrl: 'http://localhost/tutorial-hot-update/remote-assets/project.manifest',
    remoteVersionUrl: 'http://localhost/tutorial-hot-update/remote-assets/version.manifest',
    version: '1.0.0',
    assets: {},
    searchPaths: []
};

var dest = './remote-assets/';
var src = './jsb/';

// Parse arguments
var i = 2;
while (i < process.argv.length) {
    var arg = process.argv[i];
    switch (arg) {
        case '--url':
        case '-u':
            var url = process.argv[i + 1];
            manifest.packageUrl = url;
            manifest.remoteManifestUrl = url + 'project.manifest';
            manifest.remoteVersionUrl = url + 'version.manifest';
            i += 2;
            break;
        case '--version':
        case '-v':
            manifest.version = process.argv[i + 1];
            i += 2;
            break;
        case '--src':
        case '-s':
            src = process.argv[i + 1];
            i += 2;
            break;
        case '--dest':
        case '-d':
            dest = process.argv[i + 1];
            i += 2;
            break;
        default:
            i++;
            break;
    }
}


// 从配置文件中取值
var config = JSON.parse(fs.readFileSync('./config.json'))
url = config.url;
src = config.src;
dest = config.dest;
manifest.version = config.version;
manifest.packageUrl = url;
manifest.remoteManifestUrl = url + 'project.manifest';
manifest.remoteVersionUrl = url + 'version.manifest';
manifest.searchPaths = config.searchPaths;


function readDir(dir, obj) {
    var stat = fs.statSync(dir);
    if (!stat.isDirectory()) {
        return;
    }
    var subpaths = fs.readdirSync(dir), subpath, size, md5, compressed, relative;
    for (var i = 0; i < subpaths.length; ++i) {
        if (subpaths[i][0] === '.') {
            continue;
        }
        subpath = path.join(dir, subpaths[i]);
        stat = fs.statSync(subpath);
        if (stat.isDirectory()) {
            readDir(subpath, obj);
        }
        else if (stat.isFile()) {
            // Size in Bytes
            size = stat['size'];
            md5 = crypto.createHash('md5').update(fs.readFileSync(subpath, 'binary')).digest('hex');
            compressed = path.extname(subpath).toLowerCase() === '.zip';

            relative = path.relative(src, subpath);
            relative = relative.replace(/\\/g, '/');
            relative = encodeURI(relative);
            obj[relative] = {
                'size': size,
                'md5': md5
            };
            if (compressed) {
                obj[relative].compressed = true;
            }
        }
    }
}

var mkdirSync = function (path) {
    try {
        fs.mkdirSync(path);
    } catch (e) {
        if (e.code != 'EEXIST') throw e;
    }
}

// Iterate res and src folder
readDir(path.join(src, 'src'), manifest.assets);
readDir(path.join(src, 'res'), manifest.assets);

var date = new Date();
var time = date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());

mkdirSync(dest);
dest = dest + "/" + manifest.version;
mkdirSync(dest);
dest = dest + "/" + time;
mkdirSync(dest);
dest = dest + "/" + date.getHours() + "点" + date.getMinutes() + "分" + date.getSeconds() + "秒";
mkdirSync(dest);

var destManifest = path.join(dest, 'project.manifest');
var destVersion = path.join(dest, 'version.manifest');

fs.writeFile(destManifest, JSON.stringify(manifest), (err) => {
    if (err) throw err;
    console.log('Manifest successfully generated');
});

delete manifest.assets;
delete manifest.searchPaths;
fs.writeFile(destVersion, JSON.stringify(manifest), (err) => {
    if (err) throw err;
    console.log('Version successfully generated');
});

var copyFile = function (srcPath, tarPath, cb) {
    var rs = fs.createReadStream(srcPath)
    rs.on('error', function (err) {
        if (err) {
            console.log('read error', srcPath)
        }
        cb && cb(err)
    })

    var ws = fs.createWriteStream(tarPath)
    ws.on('error', function (err) {
        if (err) {
            console.log('write error', tarPath)
        }
        cb && cb(err)
    })
    ws.on('close', function (ex) {
        cb && cb(ex)
    })

    rs.pipe(ws)
}

var copyFolder = function (srcDir, tarDir, cb) {
    fs.readdir(srcDir, function (err, files) {
        var count = 0
        var checkEnd = function () {
            ++count == files.length && cb && cb()
        }

        if (err) {
            checkEnd()
            return
        }

        files.forEach(function (file) {
            var srcPath = path.join(srcDir, file)
            var tarPath = path.join(tarDir, file)

            fs.stat(srcPath, function (err, stats) {
                if (stats.isDirectory()) {
                    console.log('copyDir to ', tarPath)
                    fs.mkdir(tarPath, function (err) {
                        if (err) {
                            console.log(err)
                            return
                        }

                        copyFolder(srcPath, tarPath, checkEnd)
                    })
                } else {
                    console.log('copyFile to ', tarPath)
                    copyFile(srcPath, tarPath, checkEnd)
                }
            })
        })
        //为空时直接回调
        files.length === 0 && cb && cb()
    })
}

mkdirSync(dest + "/res");
mkdirSync(dest + "/src");
copyFolder(src + "/src", dest + "/src", function () {
    console.log("The folder 'src' has been copied!");
    // console.log("文件路径:", path.resolve(dest) + "\\");
});
copyFolder(src + "/res", dest + "/res", function () {
    console.log("The folder 'res' has been copied!");
    console.log("文件路径:", path.resolve(dest) + "\\");
});

var exec = require('child_process').exec;
var path_ = path.resolve(dest);
// exec(`explorer.exe /select,"${path_}"`)
exec(`explorer.exe "${path_}"`)
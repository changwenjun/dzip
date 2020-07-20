import { obj } from './package/zip.js'
export default class ZipArchive {
    constructor() {
        this.name = 'untitled';
        this.zippedBlob = {};
        this.length = 0;
        this.fileNum = 0;
        this.onend = ()=>{};
        this.onprogress = () => { };
        this.errorInfo = '';
        // 创建一个延迟对象;
        // var def = this.defer = new $.Deferred()
        this.defer = new Promise((resolve, reject) => {
            obj.zip.createWriter(new obj.zip.BlobWriter('application/zip'), (zipWriter) => {
                // this.zipWriter = zipWriter
                // 继续执行队列;
                resolve(zipWriter)
            }, (e) => {
                this.errorInfo=e
            })
        })
        this.blob = (filename, content) => {
            return new Blob([content], {
                type: obj.zip.getMimeType(filename)
            })
        }
    }
    /**
     * @desc 添加文件
     * @param String filename为文件的名字(若要创建文件夹，则通过 zipWriter.addFile("directory/filename.txt", blob())创建文件夹和对应文件);
     * @param String content;
     * @param Object options 传参
     *   例如：{ level : 0} 压缩的等级，0 到 9；
     *   例如：{ comment : "提示文字" }
     *   例如：{ lastModDate : "最后编辑时间" }
     * */
    addFile(filename, content, options) {
        let blob = this.blob(filename, content)
        // 为了产生链式的效果， 必须把deferrer赋值给新的defer
        if (this.errorInfo !== '') {
            console.log(this.errorInfo)
            return Promise.reject('压缩文件异常！')
        }
        return this.defer = this.defer.then((zipWriter) => {
            return new Promise((resolve, reject) => {
                zipWriter.add(filename, new obj.zip.BlobReader(blob), () => {
                    this.fileNum += 1
                    resolve(zipWriter)
                }, (size, total) => { // onend
                    this.onend(filename, blob, total)
                    this.length += total
                }, () => { // onprogress
                    this.onprogress(filename, blob, total)
                }, options || {
                    // options
                })
            })

        })
    }

    size() {
        return this.length
    }

    /**
     * @desc 获取blob文件
     * */
    get() {
        return this.zippedBlob
    }

    /**
     * @desc 导出为zip文件
     * */
    export(filename) {
        let name = filename || this.name
        return this.defer.then((zipWriter) => {
            return new Promise((resolve, reject) => {
                zipWriter.close((zippedBlob) => {
                    if (typeof name === 'string' || typeof name === 'number') {
                        var downloadButton = document.createElement('a')
                        var URL = window.URL || window.webkitURL || window.mozURL
                        downloadButton.href = URL.createObjectURL(zippedBlob)
                        downloadButton.download = name + '.zip'
                        downloadButton.click()
                    } else {
                        name(zippedBlob)
                    }
                    resolve();
                })
            })
        })
    }

    error() {
        this.onerror(this)
        throw new Error('Create Zip File Error!')
    }
}
window.ZipArchive = ZipArchive;

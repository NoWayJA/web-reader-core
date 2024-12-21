import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

console.log('Copying files...')
dotenv.config()

Object.keys(process.env).forEach(key => {
    if (key.startsWith('MODULE_') && process.env[key] === 'true') {
        console.log(key, process.env[key])
        const moduleName = key.split('_')[1]
        const copyFiles = (source, destination,extensions) => {
            if (!fs.existsSync(source)) {
                console.log(`Module ${source} does not exist.`)
                return
            }
            if (fs.lstatSync(source).isDirectory()) {
                fs.readdirSync(source).forEach(file => {
                    const sourceFile = path.join(source, file)
                    const destinationFile = path.join(destination, file)
                    copyFiles(sourceFile, destinationFile,extensions)
                })
            }
            else {
                if (extensions.includes(path.extname(source))) {
                    fs.mkdirSync(path.dirname(destination), { recursive: true })
                    fs.copyFileSync(source, destination)
                }
            }
        }

        console.log('Copying module code:')
        copyFiles( path.resolve(__dirname, `../modules/${moduleName}/app`), path.resolve(__dirname, `../../app/(home)/(modules)/${moduleName}`),['.tsx','.ts','.js','.jsx','.css','.scss','.json'])
    
        console.log('Copying admin code:')
        copyFiles( path.resolve(__dirname, `../modules/${moduleName}/admin`), path.resolve(__dirname, `../../app/(home)/admin/(modules)/${moduleName}`),['.tsx','.ts','.js','.jsx','.css','.scss','.json'])

        console.log('Copying prisma models:')
        copyFiles( path.resolve(__dirname, `../modules/${moduleName}/database`), path.resolve(__dirname, `../../prisma/schema`),['.prisma'])

        console.log('Copying api routes:')
        copyFiles( path.resolve(__dirname, `../modules/${moduleName}/api`), path.resolve(__dirname, `../../app/(home)/api/(modules)/${moduleName}`),['.ts'])

        console.log('Copying public folder:')
        copyFiles( path.resolve(__dirname, `../modules/${moduleName}/public`), path.resolve(__dirname, `../../public/${moduleName}`),['.htm','.css','.js','.json','.png','.jpg','.jpeg','.svg','.gif','.ico','.js','.jsx','.ts','.tsx','.html','.css','.scss','.sass','.less'])

    }
})

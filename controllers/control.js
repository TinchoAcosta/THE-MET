import { obtenerIds, listarObras, obtenerDepartments, obtenerObra } from "../services/apiCall.js";

const consultas = {
    async cargarHome(req, res){
        const url1 = 'https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=1'
        const url2 = 'https://collectionapi.metmuseum.org/public/collection/v1/departments'
        const departments = await obtenerDepartments(url2)
        const ids = await obtenerIds(url1)
        const objetos = await listarObras(ids)

        const itemsPerPage = 20;
        const page = parseInt(req.query.page) || 1;    
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = page * itemsPerPage;
        const items = objetos.slice(startIndex, endIndex);
        const totalPages = Math.ceil(objetos.length / itemsPerPage);

        res.render("index", {objetos: items, departments,
            currentPage: page,
            totalPages: totalPages})
    },
    async filtrar(req, res) {
        const url = 'https://collectionapi.metmuseum.org/public/collection/v1/search?'
        const url2 = 'https://collectionapi.metmuseum.org/public/collection/v1/departments'
        const departments = await obtenerDepartments(url2)
        let urlVariable = url
        let query = req.query.query
        let department = req.query.department
        let location = req.query.geoLocation
        if(query){
            urlVariable = urlVariable + "q=" + encodeURIComponent(query)            
        }else{
            urlVariable = urlVariable + 'q=""'
        }
        if(location){
            if(urlVariable !== url){
                urlVariable += '&'
            }
            urlVariable = urlVariable + "geoLocation=" + encodeURIComponent(location)
        }
        if(department!=='Ninguno'){
            if(urlVariable !== url){
                urlVariable += '&'
            }
            urlVariable = urlVariable + "departmentId=" + encodeURIComponent(department)
        }

        if(!location && !query && department==='Ninguno'){
            res.redirect('/')
        }else{
            const ids = await obtenerIds(urlVariable)
            if(!ids){
                res.render('404')
            }else{
                const objetos = await listarObras(ids)
                const itemsPerPage = 20;
                const page = parseInt(req.query.page) || 1;    
                const startIndex = (page - 1) * itemsPerPage;
                const endIndex = page * itemsPerPage;
                const items = objetos.slice(startIndex, endIndex);
                const totalPages = Math.ceil(objetos.length / itemsPerPage);
                const queryParams = req.query
                res.render("buscar", {objetos: items, departments,
                    currentPage: page,
                    totalPages: totalPages,
                    queryParams
                })
            }
        }
    },
    async imagenExtra(req,res){
        const id = req.query.id
        const objeto = await obtenerObra(id)
        if(objeto){
            res.render("imagenes", {objeto})
        }else{
            res.render('404')
        }
    }
}
export default consultas
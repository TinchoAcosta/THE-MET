import translate from './translate-bridge.cjs';

const apiUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/objects';

export async function obtenerIds(endpoint) {
  try {
    const respuesta = await fetch(endpoint)

    if (respuesta.status != 200) {
      throw new Error(`Error en la petición ${respuesta.status}.`);
    }

    const idsJson = await respuesta.json()
    const idsTotales = await idsJson.objectIDs
    const ids = idsTotales.slice(0,80)
    return ids
  } catch (error) {
    console.log(error.message)
  }
}
export async function obtenerDepartments(endpoint) {
  try {
    const respuesta = await fetch(endpoint)

    if (respuesta.status != 200) {
      throw new Error(`Error en la petición ${respuesta.status}.`);
    }

    const departmentsJ = await respuesta.json()
    const departments = await departmentsJ.departments
    return departments
  } catch (error) {
    console.log(error.message)
  }
}
export async function listarObras(ids) {
  let obras = [];
  const promesas = ids.map(async id => {
    try {
      const respuesta = await fetch(`${apiUrl}/${id}`)
      if (respuesta.status != 200) {
        throw new Error(`Error en la petición. CODIGO: ${respuesta.status}.`);
      }
      const objeto = await respuesta.json()

      if (objeto.title) {
        translate({ text: objeto.title, target: 'es', source: 'auto' })
          .then(result => {
            objeto.title = result.translation
          })
          .catch(err => {
            console.error(err);
          });
      }
      if (objeto.culture) {
        translate({ text: objeto.culture, target: 'es', source: 'auto' })
          .then(result => {
            objeto.culture = result.translation
          })
          .catch(err => {
            console.error(err);
          });
      }
      if (objeto.dynasty) {
        translate({ text: objeto.dynasty, target: 'es', source: 'auto' })
          .then(result => {
            objeto.dynasty = result.translation
          })
          .catch(err => {
            console.error(err);
          });
      }

      obras.push(objeto)
    } catch (error) {
      console.error(error.message);
    }
  });
  await Promise.all(promesas)
  return obras
}
export async function obtenerObra(id) {
  try {
    const respuesta = await fetch(`${apiUrl}/${id}`)
    if (respuesta.status != 200) {
      throw new Error(`Error en la petición. CODIGO: ${respuesta.status}.`);
    }
    const objeto = await respuesta.json()
    if (objeto.title) {
      await translate({ text: objeto.title, target: 'es', source: 'en' })
        .then(result => {
          objeto.title = result.translation
        })
        .catch(err => {
          console.error(err);
        });
      }
    return objeto
  } catch (error) {
    console.error(error.message);
  }
}
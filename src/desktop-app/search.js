

export const element = {
  $input: null,
  $loading: null,
  api: 'https://bo.sentralcargo.co.id/api/resiinfo/'
}

export const searching = async (resi) => {
  try{
    if(!resi) throw new Error('Resi tidak valid')
    const rsp = await fetch(element.api + resi);
    if(!rsp.ok) throw new Error('Error Fetch');
    const rspJson = await rsp.json();
    return {
      ok: true,
      data: rspJson
    }
  }
  catch(err){
    console.log(err.stack)
    return {
      ok: false,
      message: err.message
    }
  }
}

export const search = {
  element,
  searching,
}

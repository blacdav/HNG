export default async function classify(prop) {
    const rqst = await fetch(`https://api.genderize.io?name=${prop}`)

    const resp = await rqst.json()

    console.log(resp)

    return resp;
}
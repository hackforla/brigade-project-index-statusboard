export default function slugify(s){
    return s.toLowerCase().replace( /[^\w]+/g, '' )
}
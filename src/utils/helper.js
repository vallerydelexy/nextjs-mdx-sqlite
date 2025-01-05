export function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  export function slugify(string) {
    if(string){
      return string
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
    }
  }

  export function getSlugFromReqeustUrl (request){
    return /[^/]+$/.exec(request.nextUrl.pathname)[0]
  }

  export function tanggal (date){
    return new Date(date).toLocaleDateString("id-ID", {year: 'numeric', month: 'long', day: 'numeric'})
  }
  
class Infos {
   constructor(
      siteTitle,
      siteSubTitle,
      presentationTitle,
      presentationContent,
      presentationImage,
      adresse,
      codepostal,
      ville,
      telephone
   ) {
      this.siteTitle = siteTitle
      this.siteSubTitle = siteSubTitle
      this.presentationTitle = presentationTitle
      this.presentationContent = presentationContent
      this.presentationImage = presentationImage
      this.adresse = adresse
      this.codepostal = codepostal
      this.ville = ville
      this.telephone = telephone
   }
}

module.exports = { Infos }

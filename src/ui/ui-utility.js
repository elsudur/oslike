export function templateCompiler(strHTML) {
    try {
        const templateElement = document.createElement("template");
        templateElement.innerHTML = strHTML.trim();
        const compiledTemplate = Mikado.compile(templateElement);
        if(!compiledTemplate) throw new Error('Template gagal di compile');
        return compiledTemplate
    }
    catch (err) {
        console.log(err);
        alert(err.message);
    }
}
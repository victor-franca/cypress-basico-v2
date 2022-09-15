/// <reference types="Cypress" />



describe("Central de Atendimento ao Cliente TAT" , function() {
    beforeEach(function(){
        cy.visit ("./src/index.html")
    })

    it ("verfica o titulo da aplicação",function(){
       cy.title().should("be.equal","Central de Atendimento ao Cliente TAT")
    })

    it("campos nome, sobrenome e email preenchidos",function(){
        cy.get("#firstName").type("Victor")
        cy.get("#lastName").type("França")
        cy.get("#email").type("teste@gmail.com")
        cy.get("#open-text-area").type("Obrigado!!!!")
        cy.get('button[type="submit"]').click()
       // cy.get("span[class='success'] > strong").should("have.text","Mensagem enviada com sucesso.") funciona mas nesse sistema não
      cy.get (".success").should("be.visible")
    })

    it("teste com digitação imediata",function(){
        cy.get("#firstName").type("Victor Araújo França Lindooooooooooooooooooooooooooooo",{delay:0})
        cy.get("#lastName").type("França")
        cy.get("#email").type("teste@gmail.com")
        cy.get("#open-text-area").type("Obrigado!!!!")
        cy.get('button[type="submit"]').click()
        cy.get("span[class='success'] > strong").should("have.text","Mensagem enviada com sucesso.") 
    })

    it("exibe mensagem de erro ao submeter o fumulario com um email com formatacao invalida",function(){
        cy.get("#firstName").type("Victor")
        cy.get("#lastName").type("França")
        cy.get("#email").type("testegmail.com")
        cy.get("#open-text-area").type("Obrigado!!!!")
        cy.get('button[type="submit"]').click()
        cy.get (".error").should("be.visible")
        //cy.get("span[class='success'] > strong").should("have.text","Mensagem enviada com sucesso.") 
    })

    it("campo telefone continua vazio quando preenchido com valor não-numerico",function(){
        cy.get("input[id='phone']")
        .type("aaaaaaaaaaaaaaaa")
        .should("have.value","")
    })

    it ("teste valida mensagem de erro quando digitado o telefone, porém não mandado o numero do telefone",function(){
        cy.get("#firstName").type("Victor")
        cy.get("#lastName").type("França")
        cy.get("#email").type("teste@gmail.com")
        cy.get("input[id='phone-checkbox']").check()
        cy.get("#open-text-area").type("cypress é muito bom!!!")
        cy.get('button[type="submit"]').click()
        cy.get (".error").should("be.visible")
    })

    it("preenche e limpa os campos nome, sobrenome, email e telefone",function(){
        cy.get("#firstName")
            .type("Victor")
            .should("have.value","Victor")
            .clear()
            .should("have.value","")
        cy.get("#lastName")
            .type("França")
            .should("have.value","França")
            .clear()
            .should("have.value","")
        cy.get("label[for='email'] > strong").invoke("text").as("text1")
        cy.get("@text1").then((text2) =>{
            cy.get("#open-text-area").type(text2)
        })
        cy.get("input[id='phone']")
            .type("123456789")
            .should("have.value","123456789")
            .clear()
            .should("have.value","")
        cy.get("#email")
            .type("teste@gmail.com")
            .should("have.value","teste@gmail.com")
            .clear()
            .should("have.value","")
    })

    it ("exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios",function(){
        cy.get('button[type="submit"]').click()
        cy.get (".error").should("be.visible")
    })

    it("envia o formulario com sucesso usando um comando customizado",function(){
        cy.cadastro("Victor","França","teste@gmail.com","Cypress")
        cy.get (".success").should("be.visible")
    })

    it("pesquisar os elementos por cy.contains ao inves de usar o cy.get()",function(){
        cy.contains("Nome").type("Victor")
        cy.contains("Sobrenome").type("França")
        cy.contains("E-mail").type("testes@gmail.com")
        cy.get("#open-text-area").type("Obrigado!!!!")
        cy.contains("button","Enviar").click()
        cy.contains("Mensagem enviada com sucesso.").should("be.visible")
    })
    
    it("select com cypres",function(){
        cy.get("#product")
            .select("YouTube")
            .should("have.value","youtube")
    })

    it("seleciona um produto (Mentoria) por seu valor (value)",function(){
        cy.get("#product")
            .select("mentoria")
            .should("have.value","mentoria")
    })

    it("seleciona um produto (Mentoria) por seu indice",function(){
        cy.get("#product")
            .select(1)
            .should("have.value","blog")
    })

    it("marca o tipo de atendimento Feedback",function(){
        cy.get("input[value='feedback']")
            .check()
            .should("have.value","feedback")
    })

    it("marca cada tipo de atendimento",function(){
       cy.get("input[type='radio']")
            .should("have.length",3)
            .each(function($radio){
                cy.wrap($radio).check()
                .should("be.checked")
            })
    })

    it("marcar ambos checkboces, depois desmarca o último",function(){
        cy.get("input[type='checkbox']")
            .check()
            .should("be.checked")
            .last()
            .uncheck()
            .should("not.be.checked")
    })

    it("seleciona um arquivo da pasta fixtures",function(){
        cy.get("#file-upload")
            .should("not.have.value")
            .selectFile("cypress/fixtures/example.json")
            .should(function($input){
                console.log($input) //exibe no console do servidor do cypress
                expect($input[0].files[0].name).to.equal("example.json")
            })
    })
    
    it("seleciona um arquivo simulando um drag-and-drop",function(){
        cy.get("#file-upload")
        .should("not.have.value")
        .selectFile("cypress/fixtures/example.json",{action:"drag-drop"})
        .should(function($input){
            expect($input[0].files[0].name).to.equal("example.json")
        })
            
    })

    it("selecona um arquivo utilizando uma fixture para a qual foi dada um alias",function(){
        cy.fixture("example.json").as("sampleFile")
        cy.get("#file-upload")
            .selectFile("@sampleFile")
            .should(function($input){
                expect($input[0].files[0].name).to.equal("example.json")
            })    
    })
    
    it("verifica que a política de privacidade abre em outra aba sem a necessidade de um clique",function(){
        cy.get("a[href='privacy.html']")
            .should("have.attr","target","_blank")
    })

    it("acessa a pagina da politica de privacidade removendo o target e então clicando no link",function(){
        cy.get("a[href='privacy.html']")
        .invoke("removeAttr","target")
        .click()
        cy.get("#title").should("have.text","CAC TAT - Poltica de privacidade")
    })

    

})



describe("POST /sessions", () => {

  beforeEach(function() {

    cy.fixture("users").then(function (users) {
      this.users = users
    })

  })

  it("user session", function ()  {
    const userData = this.users.login

    cy.task("removeUser", userData.email)
    cy.postUser(userData)

    cy.postSession(userData).then((response) => {
      expect(response.status).to.equal(200)

      const { user, token } = response.body

      expect(user.name).to.equal(userData.name)
      expect(user.email).to.equal(userData.email)
      expect(token).not.to.be.empty
    })
  })

  it("invalid password", function () {
    const userData = this.users.inv_pass

    cy.postSession(userData)
        .then((response) => {
            expect(response.status).to.equal(401)
        })
    })

  it("email not found", function () {
    const userData = this.users.email_404

    cy.postSession(userData)
        .then((response) => {
            expect(response.status).to.equal(401)
        })
    })

})

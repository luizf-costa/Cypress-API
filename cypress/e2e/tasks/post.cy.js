describe("POST /tasks", () => {
  beforeEach(function () {
    cy.fixture('tasks/post').then(function (tasks) {
      this.tasks = tasks;
    });
  });

  it("login via api", function () {
    const { user, task } = this.tasks.create;

    cy.postSession(user).then((response) => {
      cy.log(response.body.token);
      Cypress.env("token", response.body.token);

      cy.task("removeTask", task.name, user.email);

      cy.postTask(task, response.body.token).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body.name).to.eq(task.name);
        expect(response.body.tags).to.eql(task.tags);
        expect(response.body.is_done).to.be.false;
      });
    });
  });

  it("register a new task", function () {
    const { user, task } = this.tasks.create;

    cy.task("removeUser", user.email);
    cy.postUser(user);
  });

  it("duplicate task", function () {
    const { user, task } = this.tasks.dup;

    cy.task("removeUser", user.email);
    cy.postUser(user);

    cy.postSession(user).then((response) => {
      cy.log(response.body.token);
      Cypress.env("token", response.body.token);

      cy.task("removeTask", task.name, user.email);

      cy.postTask(task, response.body.token);
      cy.postTask(task, response.body.token).then((response) => {
        expect(response.status).to.equal(409);
        expect(response.body.message).to.eq("Duplicated task!");
      });
    });
  });
});

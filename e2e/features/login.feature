Feature: Swag Labs Login

  Scenario: Successful login with standard user
    Given I am on the login page
    When I enter username "standard_user"
    And I enter password "secret_sauce"
    And I click the login button
    Then I should see the inventory page

Scenario: Unsuccessful login with empty password only
    Given I am on the login page
    When I enter username "standard_user"
    And I enter password ""
    And I click the login button
    Then I should see an error message "Epic sadface: Password is required"

Scenario: Unsuccessful login with empty username only
    Given I am on the login page
    When I enter username ""
    And I enter password "secret_sauce"
    And I click the login button
    Then I should see an error message "Epic sadface: Username is required"
import java.util.*;
import java.util.regex.Pattern;

// NEW CLASS: Role
class Role {
    private String roleName;
    public Role(String roleName) {
        this.roleName = roleName;
    }
    public String getRoleName() {
        return roleName;
    }
    @Override
    public String toString() {
        return roleName;
    }
}

// NEW CLASS: User
class User {
    private String username;
    private String password;
    private String email;
    private List<Role> roles;
    public User(String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.roles = new ArrayList<>();
    }
    public String getUsername() {
        return username;
    }
    public boolean checkPassword(String password) {
        return this.password.equals(password);
    }
    public void setPassword(String newPassword) {
        this.password = newPassword;
    }
    public String getEmail() {
        return email;
    }
    public List<Role> getRoles() {
        return roles;
    }
    public void addRole(Role role) {
        for (Role r : roles) {
            if (r.getRoleName().equalsIgnoreCase(role.getRoleName())) {
                return;
            }
        }
        roles.add(role);
    }
    public void removeRole(String roleName) {
        roles.removeIf(r -> r.getRoleName().equalsIgnoreCase(roleName));
    }
    @Override
    public String toString() {
        return "User: " + username + ", Email: " + email + ", Roles: " + roles;
    }
}

// NEW CLASS: AccountManager
class AccountManager {
    private Map<String, User> userMap;
    public AccountManager() {
        userMap = new HashMap<>();
    }
    public String registerUser(String username, String password, String email, boolean isFirstUser) {
        if (username == null || username.trim().isEmpty()) {
            return "Error: Username cannot be empty.";
        }
        if (userMap.containsKey(username)) {
            return "Error: Username already exists.";
        }
        if (password == null || password.trim().isEmpty() || password.length() < 6) {
            return "Error: Password must be at least 6 characters long.";
        }
        if (!isValidEmail(email)) {
            return "Error: Invalid email format.";
        }
        User newUser = new User(username, password, email);
        if (isFirstUser) {
            newUser.addRole(new Role("admin"));
        } else {
            newUser.addRole(new Role("student"));
        }
        userMap.put(username, newUser);
        return "Success: User registered successfully.";
    }
    public User loginUser(String username, String password) {
        if (username == null || username.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            System.out.println("Error: All fields are required.");
            return null;
        }
        User user = userMap.get(username);
        if (user == null) {
            System.out.println("Error: User does not exist.");
            return null;
        }
        if (!user.checkPassword(password)) {
            System.out.println("Error: Invalid username or password.");
            return null;
        }
        return user;
    }
    public String deleteUser(String username, String confirmation) {
        User user = userMap.get(username);
        if (user == null) {
            return "Error: User not found.";
        }
        if (user.getRoles().stream().anyMatch(r -> r.getRoleName().equalsIgnoreCase("admin"))) {
            long adminCount = userMap.values().stream().filter(u ->
                u.getRoles().stream().anyMatch(r -> r.getRoleName().equalsIgnoreCase("admin"))
            ).count();
            if (adminCount <= 1) {
                return "Error: Cannot delete the only admin account.";
            }
        }
        if (!"Yes".equalsIgnoreCase(confirmation)) {
            return "Error: Deletion cancelled – confirmation required.";
        }
        userMap.remove(username);
        return "Success: User deleted successfully.";
    }
    public String updateUserRole(String username, String role, boolean addRole) {
        User user = userMap.get(username);
        if (user == null) {
            return "Error: User not found.";
        }
        if (addRole) {
            user.addRole(new Role(role));
            return "Success: Role added.";
        } else {
            if ("admin".equalsIgnoreCase(role)) {
                long adminCount = userMap.values().stream().filter(u ->
                    u.getRoles().stream().anyMatch(r -> r.getRoleName().equalsIgnoreCase("admin"))
                ).count();
                if (adminCount <= 1) {
                    return "Error: Cannot remove the only admin role.";
                }
            }
            user.removeRole(role);
            return "Success: Role removed.";
        }
    }
    public Collection<User> listUsers() {
        return userMap.values();
    }
    private boolean isValidEmail(String email) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        return email != null && Pattern.matches(emailRegex, email);
    }
}

// NEW CLASS: Answer
class Answer {
    private static int idCounter = 1;
    private int answerId;
    private String text;
    private boolean accepted;
    public Answer(String text) {
        this.answerId = idCounter++;
        this.text = text;
        this.accepted = false;
    }
    public int getAnswerId() {
        return answerId;
    }
    public String getText() {
        return text;
    }
    public boolean isAccepted() {
        return accepted;
    }
    public void markAsAccepted() {
        this.accepted = true;
    }
    @Override
    public String toString() {
        return "Answer " + answerId + ": " + text + (accepted ? " (Accepted)" : "");
    }
}

// NEW CLASS: Question
class Question {
    private static int idCounter = 1;
    private int questionId;
    private String text;
    private String status;
    private List<Answer> answers;
    public Question(String text) {
        this.questionId = idCounter++;
        this.text = text;
        this.status = "Unresolved";
        this.answers = new ArrayList<>();
    }
    public int getQuestionId() {
        return questionId;
    }
    public String getText() {
        return text;
    }
    public void setText(String newText) {
        this.text = newText;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String newStatus) {
        this.status = newStatus;
    }
    public List<Answer> getAnswers() {
        return answers;
    }
    public void addAnswer(Answer answer) {
        answers.add(answer);
    }
    @Override
    public String toString() {
        return "Question " + questionId + ": " + text + " [" + status + "]";
    }
}

// NEW CLASS: QuestionManager
class QuestionManager {
    private List<Question> questions;
    public QuestionManager() {
        questions = new ArrayList<>();
    }
    public String submitQuestion(String text) {
        if (text == null || text.trim().isEmpty()) {
            return "Error: Question cannot be empty.";
        }
        for (Question q : questions) {
            if (q.getText().equalsIgnoreCase(text)) {
                return "Warning: A similar question already exists.";
            }
        }
        questions.add(new Question(text));
        return "Success: Question submitted.";
    }
    public String updateQuestion(int questionId, String newText) {
        if (newText == null || newText.trim().isEmpty()) {
            return "Error: Updated question text cannot be empty.";
        }
        for (Question q : questions) {
            if (q.getQuestionId() == questionId) {
                q.setText(newText);
                return "Success: Question updated.";
            }
        }
        return "Error: Question not found.";
    }
    public List<Question> getUnresolvedQuestions() {
        List<Question> unresolved = new ArrayList<>();
        for (Question q : questions) {
            if ("Unresolved".equalsIgnoreCase(q.getStatus())) {
                unresolved.add(q);
            }
        }
        return unresolved;
    }
    public String markAnswerAsAccepted(int questionId, int answerId) {
        for (Question q : questions) {
            if (q.getQuestionId() == questionId) {
                for (Answer a : q.getAnswers()) {
                    if (a.getAnswerId() == answerId) {
                        a.markAsAccepted();
                        q.setStatus("Resolved");
                        return "Success: Answer marked as accepted.";
                    }
                }
                return "Error: Selected answer is not valid for this question.";
            }
        }
        return "Error: Question not found.";
    }
    public List<Question> listQuestions() {
        return questions;
    }
}

// NEW CLASS: Review
class Review {
    private static int idCounter = 1;
    private int reviewId;
    private String content;
    private Integer originalReviewId;
    public Review(String content) {
        this.reviewId = idCounter++;
        this.content = content;
        this.originalReviewId = null;
    }
    public int getReviewId() {
        return reviewId;
    }
    public String getContent() {
        return content;
    }
    public Integer getOriginalReviewId() {
        return originalReviewId;
    }
    public void setOriginalReviewId(int originalId) {
        this.originalReviewId = originalId;
    }
    public void updateContent(String newContent) {
        this.content = newContent;
    }
    @Override
    public String toString() {
        return "Review " + reviewId + ": " + content + (originalReviewId != null ? " (Updated from Review " + originalReviewId + ")" : "");
    }
}

// NEW CLASS: ReviewManager
class ReviewManager {
    private List<Review> reviews;
    public ReviewManager() {
        reviews = new ArrayList<>();
    }
    public String submitReview(String content) {
        if (content == null || content.trim().isEmpty()) {
            return "Error: Review content cannot be empty.";
        }
        reviews.add(new Review(content));
        return "Success: Review submitted.";
    }
    public String updateReview(int reviewId, String newContent) {
        if (newContent == null || newContent.trim().isEmpty()) {
            return "Error: Review update cannot be empty.";
        }
        for (Review r : reviews) {
            if (r.getReviewId() == reviewId) {
                if (r.getOriginalReviewId() == null) {
                    r.setOriginalReviewId(r.getReviewId());
                }
                r.updateContent(newContent);
                return "Success: Review updated.";
            }
        }
        return "Error: Review not found.";
    }
    public List<Review> listReviews() {
        return reviews;
    }
}

// NEW CLASS: UIController
class UIController {
    private Scanner scanner;
    private AccountManager accountManager;
    private QuestionManager questionManager;
    private ReviewManager reviewManager;
    private User currentUser;
    public UIController() {
        scanner = new Scanner(System.in);
        accountManager = new AccountManager();
        questionManager = new QuestionManager();
        reviewManager = new ReviewManager();
        currentUser = null;
    }
    public void start() {
        System.out.println("Welcome to HW2 Student Q&A System");
        if (accountManager.listUsers().isEmpty()) {
            System.out.println("No users found. Please register the first user (admin).");
            register(true);
	    if(accountManager.listUsers().isEmpty())
                 return;
        }
        boolean exit = false;
        while (!exit) {
            System.out.println("\nMain Menu:");
            System.out.println("1. Register new user");
            System.out.println("2. Login");
            System.out.println("3. List Users (Admin only)");
            System.out.println("4. Submit a Question");
            System.out.println("5. List Unresolved Questions");
            System.out.println("6. Update a Question");
            System.out.println("7. Mark Answer as Accepted");
            System.out.println("8. Submit a Review");
            System.out.println("9. Update a Review");
            System.out.println("0. Exit");
            System.out.print("Enter option: ");
            String option = scanner.nextLine();
            switch(option) {
                case "1":
                    register(false);
                    break;
                case "2":
                    login();
                    break;
                case "3":
                    listUsers();
                    break;
                case "4":
                    submitQuestion();
                    break;
                case "5":
                    listUnresolvedQuestions();
                    break;
                case "6":
                    updateQuestion();
                    break;
                case "7":
                    markAnswerAccepted();
                    break;
                case "8":
                    submitReview();
                    break;
                case "9":
                    updateReview();
                    break;
                case "0":
                    exit = true;
                    System.out.println("Exiting application.");
                    break;
                default:
                    System.out.println("Invalid option. Please try again.");
            }
        }
    }
    private void register(boolean isFirstUser) {
        System.out.print("Enter username: ");
        String username = scanner.nextLine();
        System.out.print("Enter password (min 6 chars): ");
        String password = scanner.nextLine();
        System.out.print("Enter email: ");
        String email = scanner.nextLine();
        String result = accountManager.registerUser(username, password, email, isFirstUser);
        System.out.println(result);
    }
    private void login() {
        System.out.print("Enter username: ");
        String username = scanner.nextLine();
        System.out.print("Enter password: ");
        String password = scanner.nextLine();
        User user = accountManager.loginUser(username, password);
        if (user != null) {
            currentUser = user;
            System.out.println("Login successful. Welcome " + currentUser.getUsername() + "!");
            System.out.println("Your roles: " + currentUser.getRoles());
        }
    }
    private void listUsers() {
        if (currentUser == null || currentUser.getRoles().stream().noneMatch(r -> r.getRoleName().equalsIgnoreCase("admin"))) {
            System.out.println("Error: Only admin can list users.");
            return;
        }
        System.out.println("User List:");
        for (User user : accountManager.listUsers()) {
            System.out.println(user);
        }
    }
    private void submitQuestion() {
        System.out.print("Enter your question: ");
        String questionText = scanner.nextLine();
        String result = questionManager.submitQuestion(questionText);
        System.out.println(result);
    }
    private void listUnresolvedQuestions() {
        List<Question> unresolved = questionManager.getUnresolvedQuestions();
        if (unresolved.isEmpty()) {
            System.out.println("No unresolved questions.");
        } else {
            System.out.println("Unresolved Questions:");
            for (Question q : unresolved) {
                System.out.println(q);
                for (Answer a : q.getAnswers()) {
                    System.out.println("  " + a);
                }
            }
        }
    }
    private void updateQuestion() {
        System.out.print("Enter question ID to update: ");
        int qId = Integer.parseInt(scanner.nextLine());
        System.out.print("Enter updated question text: ");
        String newText = scanner.nextLine();
        String result = questionManager.updateQuestion(qId, newText);
        System.out.println(result);
    }
    private void markAnswerAccepted() {
        System.out.print("Enter question ID: ");
        int qId = Integer.parseInt(scanner.nextLine());
        System.out.print("Enter answer ID to mark as accepted: ");
        int aId = Integer.parseInt(scanner.nextLine());
        String result = questionManager.markAnswerAsAccepted(qId, aId);
        System.out.println(result);
    }
    private void submitReview() {
        System.out.print("Enter review content: ");
        String reviewText = scanner.nextLine();
        String result = reviewManager.submitReview(reviewText);
        System.out.println(result);
    }
    private void updateReview() {
        System.out.print("Enter review ID to update: ");
        int rId = Integer.parseInt(scanner.nextLine());
        System.out.print("Enter updated review content: ");
        String newContent = scanner.nextLine();
        String result = reviewManager.updateReview(rId, newContent);
        System.out.println(result);
    }
}

// NEW CLASS: HW2 (Main)
public class HW2 {
    public static void main(String[] args) {
        UIController controller = new UIController();
        controller.start();
    }
}

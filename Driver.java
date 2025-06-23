import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Scanner;

public class Driver {

    // Global lists to store Dog and Monkey objects
    private static ArrayList<Dog> dogList = new ArrayList<>();
    private static ArrayList<Monkey> monkeyList = new ArrayList<>();

    // Displays the main menu
    public static void displayMenu() {
        System.out.println("\n\n");
        System.out.println("\t\t\t\tRescue Animal System Menu");
        System.out.println("[1] Intake a new dog");
        System.out.println("[2] Intake a new monkey");
        System.out.println("[3] Reserve an animal");
        System.out.println("[4] Print a list of all dogs");
        System.out.println("[5] Print a list of all monkeys");
        System.out.println("[6] Print a list of all animals that are not reserved");
        System.out.println("[7] Search animal by name, type, or acquisition country");
        System.out.println("[8] Save animal data to file");
        System.out.println("[9] Load animal data from file");            
        System.out.println("[q] Quit application");
        System.out.println();
    }

    // Populates the dog list with sample data
    public static void initializeDogList() {
        dogList.add(new Dog("Spot", "German Shepherd", "male", 1, 25.6f, "05-12-2019", "United States", "intake", false, "United States"));
        dogList.add(new Dog("Rex", "Great Dane", "male", 3, 35.2f, "02-03-2020", "United States", "Phase I", false, "United States"));
        dogList.add(new Dog("Bella", "Chihuahua", "female", 4, 25.6f, "12-12-2019", "Canada", "in service", true, "Canada"));
    }

    // Populates the monkey list with sample data
    public static void initializeMonkeyList() {
        monkeyList.add(new Monkey("Marcel", "Capuchin", 5.2f, 9.4f, 19.6f, "male", 2, 15.3f, "09-11-2019", "Canada", "Phase I", true, "Canada"));
        monkeyList.add(new Monkey("Kong", "Macaque", 4.8f, 10.2f, 20.7f, "female", 1, 17.4f, "12-05-2020", "United Kingdom", "in service", false, "United Kingdom"));
        monkeyList.add(new Monkey("Pat", "Tamarin", 5.5f, 8.6f, 18.4f, "male", 3, 18.2f, "12-10-2019", "United States", "intake", false, "United States"));
    }

    // Intake new Dog with input validation
    public static void intakeNewDog(Scanner scanner) {
        System.out.println("What is the dog's name?");
        String name = scanner.nextLine();
        for (Dog dog : dogList) {
            if (dog.getName().equalsIgnoreCase(name)) {
                System.out.println("This dog is already in our system.");
                return;
            }
        }

        System.out.print("Breed: ");
        String breed = scanner.nextLine();
        System.out.print("Gender: ");
        String gender = scanner.nextLine();
        System.out.print("Age: ");
        int age = Integer.parseInt(scanner.nextLine().trim());
        System.out.print("Weight: ");
        float weight = Float.parseFloat(scanner.nextLine().trim());
        System.out.print("Acquisition date (MM-DD-YYYY): ");
        String acqDate = scanner.nextLine();
        System.out.print("Acquisition country: ");
        String acqCountry = scanner.nextLine();
        System.out.print("Training status: ");
        String trainingStatus = scanner.nextLine();
        System.out.print("Is the dog reserved? (yes/no): ");
        boolean reserved = scanner.nextLine().trim().equalsIgnoreCase("yes");
        System.out.print("In-service country: ");
        String inServiceCountry = scanner.nextLine();

        dogList.add(new Dog(name, breed, gender, age, weight, acqDate, acqCountry, trainingStatus, reserved, inServiceCountry));
        System.out.println("Dog added successfully.");
    }

    // Intake new Monkey with input validation
    public static void intakeNewMonkey(Scanner scanner) {
        System.out.println("What is the monkey's name?");
        String name = scanner.nextLine();
        for (Monkey monkey : monkeyList) {
            if (monkey.getName().equalsIgnoreCase(name)) {
                System.out.println("This monkey is already in our system.");
                return;
            }
        }

        System.out.print("Species: ");
        String species = scanner.nextLine();
        if (!(species.equalsIgnoreCase("Capuchin") || species.equalsIgnoreCase("Guenon")
                || species.equalsIgnoreCase("Macaque") || species.equalsIgnoreCase("Marmoset")
                || species.equalsIgnoreCase("Squirrel Monkey") || species.equalsIgnoreCase("Tamarin"))) {
            System.out.println("Invalid species.");
            return;
        }

        System.out.print("Tail Length: ");
        float tailLength = Float.parseFloat(scanner.nextLine());
        System.out.print("Height: ");
        float height = Float.parseFloat(scanner.nextLine());
        System.out.print("Body Length: ");
        float bodyLength = Float.parseFloat(scanner.nextLine());
        System.out.print("Gender: ");
        String gender = scanner.nextLine();
        System.out.print("Age: ");
        int age = Integer.parseInt(scanner.nextLine());
        System.out.print("Weight: ");
        float weight = Float.parseFloat(scanner.nextLine());
        System.out.print("Acquisition date (MM-DD-YYYY): ");
        String acqDate = scanner.nextLine();
        System.out.print("Acquisition country: ");
        String acqCountry = scanner.nextLine();
        System.out.print("Training status: ");
        String trainingStatus = scanner.nextLine();
        System.out.print("Is the monkey reserved? (yes/no): ");
        boolean reserved = scanner.nextLine().equalsIgnoreCase("yes");
        System.out.print("In-service country: ");
        String inServiceCountry = scanner.nextLine();

        monkeyList.add(new Monkey(name, species, tailLength, height, bodyLength, gender, age, weight, acqDate, acqCountry, trainingStatus, reserved, inServiceCountry));
        System.out.println("Monkey added successfully.");
    }

    // Reserve an available animal
    public static void reserveAnimal(Scanner scanner) {
        System.out.print("Enter animal type (dog/monkey): ");
        String type = scanner.nextLine().toLowerCase();
        System.out.print("Enter in-service country: ");
        String country = scanner.nextLine();

        if (type.equals("dog")) {
            for (Dog dog : dogList) {
                if (!dog.getReserved() && dog.getInServiceCountry().equalsIgnoreCase(country)) {
                    dog.setReserved(true);
                    System.out.println("Dog " + dog.getName() + " has been reserved.");
                    return;
                }
            }
        } else if (type.equals("monkey")) {
            for (Monkey monkey : monkeyList) {
                if (!monkey.getReserved() && monkey.getInServiceCountry().equalsIgnoreCase(country)) {
                    monkey.setReserved(true);
                    System.out.println("Monkey " + monkey.getName() + " has been reserved.");
                    return;
                }
            }
        } else {
            System.out.println("Invalid animal type.");
        }
    }

    // Print animals by type or availability with full attributes
    public static void printAnimals(String listType) {
        if (listType.equalsIgnoreCase("dog")) {
            System.out.println("All Dogs:");
            for (Dog dog : dogList) {
                System.out.println("Dog: " + dog.getName() +
                    " | Breed: " + dog.getBreed() +
                    " | Gender: " + dog.getGender() +
                    " | Age: " + dog.getAge() +
                    " | Weight: " + dog.getWeight() +
                    " | Training: " + dog.getTrainingStatus() +
                    " | Reserved: " + dog.getReserved() +
                    " | Country: " + dog.getAcquisitionCountry() +
                    " | In Service: " + dog.getInServiceCountry());
            }

        } else if (listType.equalsIgnoreCase("monkey")) {
            System.out.println("All Monkeys:");
            for (Monkey monkey : monkeyList) {
                System.out.println("Monkey: " + monkey.getName() +
                    " | Species: " + monkey.getSpecies() +
                    " | Gender: " + monkey.getGender() +
                    " | Age: " + monkey.getAge() +
                    " | Weight: " + monkey.getWeight() +
                    " | Tail Length: " + monkey.getTailLength() +
                    " | Height: " + monkey.getHeight() +
                    " | Body Length: " + monkey.getBodyLength() +
                    " | Training: " + monkey.getTrainingStatus() +
                    " | Reserved: " + monkey.getReserved() +
                    " | Country: " + monkey.getAcquisitionCountry() +
                    " | In Service: " + monkey.getInServiceCountry());
            }

        } else if (listType.equalsIgnoreCase("available")) {
            System.out.println("Available Dogs:");
            for (Dog dog : dogList) {
                if (!dog.getReserved() && dog.getTrainingStatus().equalsIgnoreCase("in service")) {
                    System.out.println("Dog: " + dog.getName() + " | In Service Country: " + dog.getInServiceCountry());
                }
            }

            System.out.println("Available Monkeys:");
            for (Monkey monkey : monkeyList) {
                if (!monkey.getReserved() && monkey.getTrainingStatus().equalsIgnoreCase("in service")) {
                    System.out.println("Monkey: " + monkey.getName() + " | In Service Country: " + monkey.getInServiceCountry());
                }
            }

        } else {
            System.out.println("Invalid list type. Please use 'dog', 'monkey', or 'available'.");
        }
    }


    // Search animals with input validation
    public static void searchAnimals(Scanner scanner) {
        System.out.print("Search by (name/type/country): ");
        String field = scanner.nextLine().toLowerCase();

        if (!(field.equals("name") || field.equals("type") || field.equals("country"))) {
            System.out.println("Invalid field. Please enter 'name', 'type', or 'country'.");
            return;
        }

        System.out.print("Enter value to search: ");
        String value = scanner.nextLine().toLowerCase();

        boolean found = false;

        for (Dog dog : dogList) {
            if ((field.equals("name") && dog.getName().equalsIgnoreCase(value)) ||
                (field.equals("type") && "dog".equalsIgnoreCase(value)) ||
                (field.equals("country") && dog.getAcquisitionCountry().equalsIgnoreCase(value))) {
                System.out.println("Dog: " + dog.getName() + " | " + dog.getTrainingStatus() + " | " + dog.getAcquisitionCountry());
                found = true;
            }
        }

        for (Monkey monkey : monkeyList) {
            if ((field.equals("name") && monkey.getName().equalsIgnoreCase(value)) ||
                (field.equals("type") && "monkey".equalsIgnoreCase(value)) ||
                (field.equals("country") && monkey.getAcquisitionCountry().equalsIgnoreCase(value))) {
                System.out.println("Monkey: " + monkey.getName() + " | " + monkey.getTrainingStatus() + " | " + monkey.getAcquisitionCountry());
                found = true;
            }
        }

        if (!found) {
            System.out.println("No matching animal found.");
        }
    }

    // Save all animal data to a file
    public static void saveAnimalData() {
        try (PrintWriter writer = new PrintWriter("animals.txt")) {
        // Save dogs
        for (Dog dog : dogList) {
            writer.println("Dog," + dog.getName() + "," + dog.getBreed() + "," + dog.getGender() + "," + dog.getAge()
                    + "," + dog.getWeight() + "," + dog.getAcquisitionDate() + "," + dog.getAcquisitionCountry()
                    + "," + dog.getTrainingStatus() + "," + dog.getReserved() + "," + dog.getInServiceCountry());
        }
        // Save monkeys
        for (Monkey monkey : monkeyList) {
            writer.println("Monkey," + monkey.getName() + "," + monkey.getSpecies() + "," + monkey.getTailLength()
                    + "," + monkey.getHeight() + "," + monkey.getBodyLength() + "," + monkey.getGender()
                    + "," + monkey.getAge() + "," + monkey.getWeight() + "," + monkey.getAcquisitionDate()
                    + "," + monkey.getAcquisitionCountry() + "," + monkey.getTrainingStatus() + ","
                    + monkey.getReserved() + "," + monkey.getInServiceCountry());
        }
        System.out.println("Animal data saved to animals.txt");
    } catch (IOException e) {
        System.out.println("Error saving data: " + e.getMessage());
    }
}

    // Load animal data from a file
    public static void loadAnimalData() {
        try (Scanner fileScanner = new Scanner(new File("animals.txt"))) {
            dogList.clear();
            monkeyList.clear();

        while (fileScanner.hasNextLine()) {
            String[] tokens = fileScanner.nextLine().split(",");
            if (tokens[0].equalsIgnoreCase("Dog")) {
                dogList.add(new Dog(tokens[1], tokens[2], tokens[3], Integer.parseInt(tokens[4]),
                        Float.parseFloat(tokens[5]), tokens[6], tokens[7], tokens[8],
                        Boolean.parseBoolean(tokens[9]), tokens[10]));
            } else if (tokens[0].equalsIgnoreCase("Monkey")) {
                monkeyList.add(new Monkey(tokens[1], tokens[2], Float.parseFloat(tokens[3]),
                        Float.parseFloat(tokens[4]), Float.parseFloat(tokens[5]), tokens[6],
                        Integer.parseInt(tokens[7]), Float.parseFloat(tokens[8]), tokens[9],
                        tokens[10], tokens[11], Boolean.parseBoolean(tokens[12]), tokens[13]));
            }
        }
        System.out.println("Animal data loaded successfully.");
    } catch (IOException e) {
        System.out.println("Error loading data: " + e.getMessage());
    }
}


    public static void main(String[] args) {
        initializeDogList();
        initializeMonkeyList();
        Scanner sc = new Scanner(System.in);

        while (true) {
            displayMenu();
            System.out.print("Enter a menu selection: ");
            String input = sc.nextLine().trim();

            if (input.equalsIgnoreCase("q")) {
                System.out.println("Goodbye.");
                break;
            }

            switch (input) {
                case "1": intakeNewDog(sc); break;
                case "2": intakeNewMonkey(sc); break;
                case "3": reserveAnimal(sc); break;
                case "4": printAnimals("dog"); break;
                case "5": printAnimals("monkey"); break;
                case "6": printAnimals("available"); break;
                case "7": searchAnimals(sc); break;
                case "8":
                    saveAnimalData();
                    break;
                case "9":
                    loadAnimalData();
                    break;
                
                default: System.out.println("Invalid option.");
            }
        }

        sc.close();
    }
}

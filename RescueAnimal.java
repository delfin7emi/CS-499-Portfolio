public class RescueAnimal {
    private String name;
    private String type;
    private String gender;
    private int age;
    private float weight;
    private String acquisitionDate;  // Changed from SimpleDateFormat to String
    private String acquisitionCountry;
    private String trainingStatus;
    private boolean reserved;
    private String inServiceCountry;

    // Default constructor
    public RescueAnimal() {}

    // Constructor for shared attributes
    public RescueAnimal(String name, String type, String gender, int age, float weight,
                        String acquisitionDate, String acquisitionCountry, String trainingStatus,
                        boolean reserved, String inServiceCountry) {
        this.name = name;
        this.type = type;
        this.gender = gender;
        this.age = age;
        this.weight = weight;
        this.acquisitionDate = acquisitionDate;
        this.acquisitionCountry = acquisitionCountry;
        this.trainingStatus = trainingStatus;
        this.reserved = reserved;
        this.inServiceCountry = inServiceCountry;
    }

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public float getWeight() { return weight; }
    public void setWeight(float weight) { this.weight = weight; }

    public String getAcquisitionDate() { return acquisitionDate; }
    public void setAcquisitionDate(String acquisitionDate) { this.acquisitionDate = acquisitionDate; }

// Getter for acquisitionSource
public String getAcquisitionCountry() {
    return acquisitionCountry;
}

// Setter for acquisitionSource
public void setAcquisitionSource(String acquisitionSource) {
    this.acquisitionCountry = acquisitionSource;
}

    public String getTrainingStatus() { return trainingStatus; }
    public void setTrainingStatus(String trainingStatus) { this.trainingStatus = trainingStatus; }

    public boolean getReserved() { return reserved; }
    public void setReserved(boolean reserved) { this.reserved = reserved; }

    public String getInServiceCountry() { return inServiceCountry; }
    public void setInServiceCountry(String inServiceCountry) { this.inServiceCountry = inServiceCountry; }
}

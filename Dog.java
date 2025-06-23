public class Dog extends RescueAnimal {

    // Specific attribute for Dog
    private String breed;

    // Default constructor
    public Dog() {
        super(); // Calls parent constructor
    }

    // Constructor used in Driver.java
    public Dog(String name, String breed, String gender, int age, float weight,
               String acquisitionDate, String acquisitionCountry, String trainingStatus,
               boolean reserved, String inServiceCountry) {

        super(); // Required before using setters

        setName(name);
        setGender(gender);
        setAge(age);
        setWeight(weight);
        setAcquisitionDate(acquisitionDate);
        setAcquisitionSource(acquisitionCountry);
        setTrainingStatus(trainingStatus);
        setReserved(reserved);
        setInServiceCountry(inServiceCountry);

        this.breed = breed;
    }

    // Getter for breed
    public String getBreed() {
        return breed;
    }

   
    public void setBreed(String breed) {
        this.breed = breed;
    }

    public String getAcquisitionCountry() {
        return super.getAcquisitionCountry();
    }

    public String getInServiceCountry() {
        return super.getInServiceCountry();
    }
}



public class Monkey extends RescueAnimal {

    private float tailLength;
    private float height;
    private float bodyLength;
    private String species;

    // Default constructor
    public Monkey() {
        super(); // Calls RescueAnimal constructor
    }

    // Constructor used in Driver.java
    public Monkey(String name, String species, float tailLength, float height, float bodyLength,
                  String gender, int age, float weight, String acquisitionDate,
                  String acquisitionCountry, String trainingStatus, boolean reserved, String inServiceCountry) {

        super(); // Set inherited attributes

        setName(name);
        setGender(gender);
        setAge(age);
        setWeight(weight);
        setAcquisitionDate(acquisitionDate);
        setAcquisitionSource(acquisitionCountry);
        setTrainingStatus(trainingStatus);
        setReserved(reserved);
        setInServiceCountry(inServiceCountry);

        this.species = species;
        this.tailLength = tailLength;
        this.height = height;
        this.bodyLength = bodyLength;
    }

    // Monkey-specific getters and setters
    public float getTailLength() {
        return tailLength;
    }

    public void setTailLength(float tailLength) {
        this.tailLength = tailLength;
    }

    public float getHeight() {
        return height;
    }

    public void setHeight(float height) {
        this.height = height;
    }

    public float getBodyLength() {
        return bodyLength;
    }

    public void setBodyLength(float bodyLength) {
        this.bodyLength = bodyLength;
    }

    public String getSpecies() {
        return species;
    }

    public void setSpecies(String species) {
        this.species = species;
    }

    public String getAcquisitionCountry() {
        return super.getAcquisitionCountry();
    }

    public String getInServiceCountry() {
        return super.getInServiceCountry();
    }
}

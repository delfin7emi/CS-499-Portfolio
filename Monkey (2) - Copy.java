import java.text.SimpleDateFormat;

public class Monkey extends RescueAnimal {

    // Define Monkey-specific attributes
    private int tailLength;
    private int height;
    private int bodyLength;
    private String species;
    private int measurementOfTorso;
    private int measurementOfSkull;
    private int measurementOfNeck;

    // Default constructor
    public Monkey() {
        super(); // Call the superclass constructor
    }

    // Detailed constructor to initialize all attributes
    public Monkey(String name, String type, String gender, int age, float weight,
                  SimpleDateFormat acquisitionDate, SimpleDateFormat statusDate,
                  String acquisitionSource, Boolean reserved, String trainingLocation,
                  SimpleDateFormat trainingStart, SimpleDateFormat trainingEnd, String trainingStatus,
                  String inServiceCountry, String inServiceCity, String inServiceAgency, String inServicePOC,
                  String inServiceEmail, String inServicePhone, String inServicePostalAddress,
                  int tailLength, int height, int bodyLength, String species,
                  int measurementOfTorso, int measurementOfSkull, int measurementOfNeck) {

        super(name, type, gender, age, weight, acquisitionDate, statusDate, acquisitionSource, reserved,
                trainingLocation, trainingStart, trainingEnd, trainingStatus, inServiceCountry, inServiceCity,
                inServiceAgency, inServicePOC, inServiceEmail, inServicePhone, inServicePostalAddress);

        // Initialize Monkey-specific attributes
        this.tailLength = tailLength;
        this.height = height;
        this.bodyLength = bodyLength;
        this.species = species;
        this.measurementOfTorso = measurementOfTorso;
        this.measurementOfSkull = measurementOfSkull;
        this.measurementOfNeck = measurementOfNeck;
    }

    // Accessors and mutators for Monkey-specific attributes
    public int getTailLength() {
        return tailLength;
    }

    public void setTailLength(int tailLength) {
        this.tailLength = tailLength;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public int getBodyLength() {
        return bodyLength;
    }

    public void setBodyLength(int bodyLength) {
        this.bodyLength = bodyLength;
    }

    public String getSpecies() {
        return species;
    }

    public void setSpecies(String species) {
        this.species = species;
    }

    public int getMeasurementOfTorso() {
        return measurementOfTorso;
    }

    public void setMeasurementOfTorso(int measurementOfTorso) {
        this.measurementOfTorso = measurementOfTorso;
    }

    public int getMeasurementOfSkull() {
        return measurementOfSkull;
    }

    public void setMeasurementOfSkull(int measurementOfSkull) {
        this.measurementOfSkull = measurementOfSkull;
    }

    public int getMeasurementOfNeck() {
        return measurementOfNeck;
    }

    public void setMeasurementOfNeck(int measurementOfNeck) {
        this.measurementOfNeck = measurementOfNeck;
    }
}

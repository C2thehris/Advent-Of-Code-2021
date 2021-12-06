import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Scanner;

class template {

  public static void part1(ArrayList<String> lines) {
    long solution = 0;

    System.out.println("Part 1: " + solution);
  }

  public static void part2(ArrayList<String> lines) {
    long solution = 0;

    System.out.println("Part 2: " + solution);
  }

  public static void main(String[] args) {
    ArrayList<String> lines = new ArrayList<>();

    if (args.length < 1) {
      System.err.println("Invalid Usage. Usage: java template [filename]");
      System.exit(1);
    }

    try (Scanner scn = new Scanner(new File(args[0]))) {
      while (scn.hasNextLine()) {
        lines.add(scn.nextLine());
      }
      part1(lines);
      part2(lines);
    } catch (FileNotFoundException e) {
      e.printStackTrace();
      System.err.println("File not found: " + args[0]);
    }

    System.exit(0);
  }

}